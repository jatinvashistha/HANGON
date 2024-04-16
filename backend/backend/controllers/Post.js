const { json } = require("express");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const Notification = require("../models/Notification");
const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const newPost = {
      caption: req.body.caption,
      imageUrl: req.body.image,
      owner: req.user._id,
    };

    const post = await Post.create(newPost);

    const user = await User.findOne({ _id: req.user._id });
    await user.posts.push(post._id);
    await user.save();

    res.status(201).json({
      success: true,
      post,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.likeAndUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("likes");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post don't exists",
      });
    }
    var index = -1;
    var likeId;
    const liked = post.likes.find((like, key) => {
      if (like.user.toString() == req.user._id.toString()) {
        index = key;
        likeId = like._id;
        return like;
      }
    });

    if (liked) {
      const like = await Like.findById(liked);
      const notification = await Notification.findByIdAndDelete(like.notify);
      await Like.findByIdAndDelete(like._id);
      post.likes.splice(index, 1);
      await post.save();
      return res.status(200).json({
        message: "Post Unliked",
      });
    } else {
      if (post.owner.toString() === req.user._id.toString()) {
        const like = {
          user: req.user._id,
          item: post._id,
          itemType: "Post",
          notify : null
        };
        const postLike = await Like.create(like);
        post.likes.push(postLike._id);
        await post.save();
        return res.status(200).json({
          success: true,
          message: "Post liked",
          like: postLike,
        });
      } else {
        const like = {
          user: req.user._id,
          item: post._id,
          itemType: "Post",
          notify: null,
          post : post._id
        };

        const postLike = await Like.create(like);
        console.log(like.post)
        const notification = {
          message: "Liked your post",
          itemModel: "Like",
          item: postLike._id,
          sender: req.user._id,
          receiver: [post.owner],
        };

        const postNotification = await Notification.create(notification);
        postLike.notify = postNotification._id;
        await postLike.save();
        
        post.likes.push(postLike._id);
        await post.save();
        return res.status(200).json({
          success: true,
          message: "Post liked",
          like: postLike,
        });
      }
      
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("likes");

    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }

    const user = await User.findById(req.user._id);
    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({

        success: false,
        message: "Unauthorized User",
      });
    }

    const index = user.posts.indexOf(req.params.id);
    if (index !== -1) {
      user.posts.splice(index, 1);
      await user.save();
    }

    await Promise.all(
      (post.interestedByUser || []).map(async (item) => {
        const user = await User.findById(item);
        if (user && user.interestedPost) {
          const index = user.interestedPost.indexOf(post._id);
          if (index !== -1) {
            user.interestedPost.splice(index, 1);
            await user.save();
          }
        }
      })
    );


    await Promise.all(
      (post.savedByUser || []).map(async (item) => {
        const user = await User.findById(item);
        if (user && user.savedPost) {
          const index = user.savedPost.indexOf(post._id);
          if (index !== -1) {
            user.savedPost.splice(index, 1);
            await user.save();
          }
        }
      })
    );


    const deletingComment = async (commentId) => {
      const comment = await Comment.findById(commentId).populate("likes");
      if (!comment) return;

      if (comment.repliesOf) {
        const parentComment = await Comment.findById(comment.repliesOf);
        if (parentComment) {
          const index = parentComment.reply.indexOf(comment._id);
          if (index !== -1) {
            parentComment.reply.splice(index, 1);
            await parentComment.save();
          }
        }
      }

      await Promise.all(
        (comment.likes || []).map(async (like) => {
          await Notification.findByIdAndDelete(like.notify);
          await Like.findByIdAndDelete(like._id);
        })
      );

      await Promise.all(
        (comment.notify || []).map(async (notifyId) => {
          await Notification.findByIdAndDelete(notifyId);
        })
      );

      if (comment.reply.length > 0) {
        await Promise.all(
          comment.reply.map(async (replyId) => {
            await deletingComment(replyId);
          })
        );
      }

      await Comment.findByIdAndDelete(comment._id);
    };

    await Promise.all(
      (post.comments || []).map(async (commentId) => {
        await deletingComment(commentId);
      })
    );


    await Promise.all(
      (post.likes || []).map(async (like) => {
        await Notification.findByIdAndDelete(like.notify);
        await Like.findByIdAndDelete(like._id);
      })
    );

    const x = await Post.findByIdAndDelete(post._id);
    console.log(x)

    res.status(200).json({
      success: true,
      message: "Post deleted",
      post,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.allPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const followingUserIds = user?.following.map((item) => item.user);

    const posts = await Post.find({
      owner: {
        $in: followingUserIds,
      },
    })
      .populate("owner")
      .populate({
        path: "likes",
        populate: {
          path: "user",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "sender",
        },
      });

    const totalComments = async (comment) => {
      const foundComment = await Comment.findById(comment._id)
        .populate("sender")
        .populate({
          path: "repliesOf",
          populate: {
            path: "sender",
          },
        })
        .populate({
          path: "likes",
          populate: {
            path: "user",
          },
        });

      const comments = [foundComment];

      if (foundComment?.reply.length > 0) {
        await Promise.all(
          foundComment?.reply?.map(async (item) => {
            const replies = await totalComments(item);
            comments.push(...replies); 
          })
        );
      }

      return comments;
    };
    

    const totalPost = [];
    const totalPosts = await Promise.all(
      posts.map(async (post) => {
        const comments = [];
        await Promise.all(
          (post?.comments || []).map(async (item) => {
            
            const postComments = await totalComments(item);
            comments.push(...postComments); 
          })
        );

        totalPost.push({
          post,
          comments,
        });
      })
    );

    res.status(200).json({
      success: true,
      posts: totalPost.reverse(),
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};


async function populateComments(comments) {
  const populatedComments = await Promise.all(
    comments.map(async (comment) => {
      const x = await populateComment(comment);
      if (x != null) {
        return x;
      }
    })
  );

  return populatedComments.filter((comment) => comment !== undefined);
}

const populateComment = async (comment) => {
  const populatedComment = await Comment.findById(comment._id)
    .populate("sender")
    .populate({
      path: "repliesOf",
      populate: {
        path: "sender",
      },
    });
  if (populatedComment?.reply?.length > 0) {
    await populateComments(populatedComment?.reply);
  }
  return populatedComment;
};

exports.updateCaption = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }
    post.caption = req.body.caption;
    await post.save();
    res.status(200).json({
      success: true,
      message: "Post updated",
    });
  } catch (e) {
    res.status(500).json({
      success: true,
      message: e.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: true,
        message: "Post not found",
      });
    }

    const deleteComment = await Comment.findById(req.body.commentId);
   
    if (!deleteComment) {
      return res.status(400).json({
        status: false,
        message: "Comment Not found",
      });
    }

    if (post.owner.toString() === req.user._id.toString()) {
      var commentIndex = -1;
      post.comments.forEach((item, index) => {
        if (item.toString() === deleteComment?._id.toString()) {
          commentIndex = index;
          return;
        }
      });
      if (commentIndex != -1) {
        post.comments.splice(commentIndex, 1);
        await post.save();
      }

      const deletingComment = async (comment) => {
        
        const dlt = await Comment.findById(comment).populate('likes');

        if (dlt?.repliesOf !== null &&  dlt?.repliesOf !== undefined ) {
           console.log(dlt?.repliesOf,'the reply');
           const cmnt = await Comment.findById(dlt?.repliesOf);
        
           const index = cmnt?.reply.indexOf(dlt._id);
           
           if (index !== -1) {
           
             cmnt?.reply?.splice(index, 1);
             await cmnt.save();
         }
         }
        
        await Promise.all(
          dlt.likes.map(async (item) => {
          
          await Notification.findByIdAndDelete(item?.notify)
            await Like.findByIdAndDelete(item?._id);
    
          })
        );


        await Promise.all(
          dlt.notify.map(
           async (item) => {           
              await Notification.findByIdAndDelete(item)
            }
          )
        );

        if (dlt.reply > 0) {
          await Promise.all(
            dlt?.reply?.map(async (comment) => await  deletingComment(comment))
          );
        }
        await Comment.findByIdAndDelete(dlt?._id);
      };

      deletingComment(deleteComment?._id);

      return res.status(200).json({
        success: true,
        message: "Selected Comment deleted'",
      });
    } else {
      if (deleteComment.sender.toString() === req.user._id.toString()) {
        var commentIndex = -1;

        post.comments.forEach((item, index) => {
          if (item.toString() === deleteComment?._id.toString()) {
            commentIndex = index;
            return;
          }
        });

        if (commentIndex != -1) {
          post.comments.splice(commentIndex, 1);
          await post.save();
        }

        const deletingComment = async (comment) => {

          const dlt = await Comment.findById(comment).populate("likes");
          if (dlt?.repliesOf !== null && dlt?.repliesOf !== undefined) {
            const cmnt = await Comment.findById(dlt?.repliesOf);
            const index = cmnt.reply.indexOf(dlt._id);
            if (index !== -1) {
              cmnt.reply.splice(index, 1);
              await cmnt.save();
            }
          }
          await Promise.all(
            dlt.likes.map(async (item) => {

              await Notification.findByIdAndDelete(item._notify)
              await Like.findByIdAndDelete(item._id);
            })
          );
          
          await Promise.all(
            dlt.notify.map(
              async (item) => await Notification.findByIdAndDelete(item)
            )
          );

          if (dlt.reply > 0) {
            await Promise.all(
              dlt.reply.map(async (comment) => deletingComment(comment))
            );
          }
          await Comment.findByIdAndDelete(dlt?._id);
        };

        deletingComment(deleteComment?._id);

        return res.status(200).json({
          success: true,
          message: "Selected Comment deleted'",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Comment is not going to delete by comment sender",
        });
      }
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
exports.anypost = async (req, res) => {
  try {
    const postid = req.params.id;
    const post = await Post.findById(req.params.id)
      .populate("owner")
      .populate({
        path: "likes",
        populate: {
          path: "user",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "sender",
        },
      });

    const comments = [];
    const totalComments = async (comment) => {
      const foundComment = await Comment.findById(comment._id)
        .populate("sender")
        .populate(
          {
            path: "likes",
            populate: {
              path : "user"
            }
          }
        )
        .populate({
          path: "repliesOf",
          populate: {
            path: "sender",
          },
        });
      comments.push(foundComment);
      if (foundComment?.reply?.length > 0) {
        await Promise.all(
          foundComment.reply.map(async (item, key) => {
            console.log(key);
            await totalComments(item);
          })
        );
      }
    };

    await Promise.all(
      (post?.comments || []).map(async (item) => {
        // if (item?.reply.length > 0) {
        await totalComments(item);
        // }
      })
    );

    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        postData: {
          post,
          comments,
        },
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
exports.savePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(500).json({
        success: false,
        message: "Post not found",
      });
    }
    const user = await User.findById(req.user._id);
    if (user?.savedPost?.includes(post._id)) {
      const index = user?.savedPost?.indexOf(post._id);
      user?.savedPost?.splice(index, 1);
      await user.save();
      const index2 = post?.savedByUser?.indexOf(req.user._id);
      post?.savedByUser?.splice(index2, 1);
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Unsaved Successfully",
      });
    } else {
      user?.savedPost?.push(post._id);
      await user.save();
      post?.savedByUser?.push(user?._id)
       await  post.save()
      return res.status(200).json({
        success: true,
        message: "Saved Successfully",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
exports.interestedPost = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(500).json({
        success: false,
        message: "Post not found",
      });
    }
    const user = await User.findById(req.user._id);
    if (user?.interestedPost?.includes(post._id)) {
      const index = user?.interestedPost?.indexOf(post._id);
      user?.interestedPost?.splice(index, 1);
      const index2 = post?.interestedByUser?.indexOf(req.user._id);
      post?.interestedByUser.splice(index2, 1);
      await post.save();
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Unsaved Successfully",
      });
    } else {
      user?.interestedPost?.push(post._id);
      await user.save();
      post?.interestedByUser?.push(req.user._id);
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Saved Successfully",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
// exports.addComment = async (req, res) => {
//   try {

//     const {commentId,mention, commentFromUser} = req.body;

//     const post = await Post.findById(req.params.id);
//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }
//     var comment;
//     if(commentId) {

//        comment = await Comment.findById(commentId);
//     }
// if(comment && comment?._id) {

// }
// else {

//   const mentioned = await User.findById(mention);
//   if(mentioned) {

//     if(mentioned._id.toString() === req.user._id.toString()) {

//     }else {

//       const cmnt  = await Comment.create({
//         post : post._id,
//         comment : commentFromUser
//       })
//       const notification1 = {
//         message : "Mentioned you in the comment",
//         itemModel : "Comment",
//         item :  cmnt._id,
//         sender : req.user._id,
//         receiver : mentioned._id
//       }

//       const notification2 = {
//         message : "Commented on your post",
//         itemModel : "Post",
//         item : post._id,
//         sender : req.user._id,
//         receiver : post.owner
//       }

//       const notify1  = await Notification.create(notification1);
//       const notify2 = await Notification.create(notification2);
//       console.log(notify2);
//       cmnt.notify.push(notify1._id);
//       cmnt.notify.push(notify2._id);
//      await  cmnt.save();
//      return res.status(200).json({
//       success : true,
//       comment : cmnt
//      })
//     }
//   }
// }

//   } catch (e) {
//     res.status(500).json({});
//   }
// };
exports.addComment = async (req, res) => {
  try {
    const { commentId, comment, mention } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }

    var cmnt = null;
    if (commentId.length == 24) {
      cmnt = await Comment.findById(commentId);
    }

    var mentioned = [];
    if (mention) {
      const users = JSON.parse(mention);
      mentioned = [...users];
    }

    var mentionedUsers = [];
    const filteredMentionedUsers = await Promise.all(
      mentioned.map(async (user) => {
        const use = await User.findById(user);
        if (
          use._id.toString() === req.user._id.toString() ||
          (cmnt && use._id.toString() === cmnt.sender.toString())
        ) {
          return null;
        } else {
          return use;
        }
      })
    );

    mentionedUsers = filteredMentionedUsers.filter((user) => user !== null);

    const uniqueMentionedUsers = mentionedUsers.filter((obj, index, self) => {
      return index === self.findIndex((t) => t.id === obj.id);
    });
    var mentions = [];
    uniqueMentionedUsers.forEach((item) => {
      mentions = [...mentions, item._id];
    });
    if (post.owner.toString() === req.user._id.toString()) {
      if (cmnt) {
        if (cmnt.sender.toString() === req.user._id.toString()) {
          if (!(mentions.length > 0)) {
            const newComment = {
              item: post._id,
              sender: req.user._id,
              repliesOf: cmnt._id,
              comment,
            };

            const commentDone = await Comment.create(newComment);
            if (commentDone) {
              cmnt.reply.push(commentDone);
              await cmnt.save();
              res.status(200).json({
                success: true,
                Comment: commentDone,
              });
            } else {


              res.status(400).json({
                success: false,
                Comment: "comment is not added",
              });
            }
          } else {
            const newComment = {
              item: post._id,
              sender: req.user._id,
              repliesOf: cmnt._id,
              comment,
              mention: mentions,
            };
            const commentDone = await Comment.create(newComment);
            console.log(commentDone);
            if (commentDone) {
              const notification = {
                message: "Mentioned you in the comment",
                itemModel: "Comment",
                sender: req.user._id,
                item: commentDone._id,
                receiver: [...mentions],
              };
              const notify = await Notification.create(notification);
              commentDone.notify.push(notify._id);
              await commentDone.save();
              cmnt.reply.push(commentDone);
              await cmnt.save();
              return res.status(200).json({
                success: true,
                message: "Comment done",
                Comment: commentDone,
              });
            } else {
              return res.status(400).json({
                success: false,
                Comment: "Comment is not added",
              });
            }
          }
        } else {
          if (mentions.length > 0) {
            commentDone = await Comment.create({
              item: post._id,
              sender: req.user._id,
              repliesOf: cmnt._id,
              mention: [...mentions],
            });
            if (commentDone) {
              const notification1 = {
                message: "Mentioned you in the comment",
                itemModel: "Comment",
                item: commentDone._id,
                sender: req.user._id,
                receiver: [...mentions],
              };
              const notification2 = {
                message: "Replied to your comment",
                item: commentDone._id,
                itemModel: "Comment",
                sender: req.user._id,
                receiver: [cmnt.sender],
              };
              const notify1 = await Notification.create(notification1);
              const notify2 = await Notification.create(notification2);
              commentDone.notify.push(notify1._id);
              commentDone.notify.push(notify2._id);
              await commentDone.save();
              cmnt.reply.push(commentDone);
              await cmnt.save();
              console.log(
                "comment reply on self post with mention and other reply"
              );
              return res.status(200).json({
                success: true,
                message: "Comment done",
                Comment: commentDone,
              });
            } else {
              return res.status(400).json({
                success: false,
                message: "Comment is not added",
              });
            }
          } else {
            const commentDone = await Comment.create({
              item: post._id,
              sender: req.user._id,
              repliesOf: cmnt._id,
              comment,
            });
            console.log(commentDone,'the comment done i s');
            if (commentDone) {
              const notification = {
                message: "Replied to your comment",
                item: commentDone._id,
                itemModel: "Comment",
                sender: req.user._id,
                receiver: [cmnt._sender],
              };
              const notify = await Notification.create(notification);
              commentDone.notify.push(notify._id);
              await commentDone.save();
              cmnt.reply.push(commentDone._id);
              await cmnt.save();
              console.log(
                "comment reply  on self post on other reply with out mention"
              );
              res.status(200).json({
                success: true,
                message: "Comment done successfully",
                Comment: commentDone,
              });
            } else {
              return res.status(400).json({
                success: false,
                message: "Comment is not added",
              });
            }
          }
        }
      } else {
        if (mentions.length > 0) {
          const commentDone = await Comment.create({
            item: post._id,
            sender: req.user._id,
            mention: [...mentions],
          });
          const notify = await Notification.create({
            message: "Mentioned you in the comment",
            itemModel: "Comment",
            item: commentDone._id,
            sender: req.user._id,
            receiver: [...mentions],
          });
          commentDone.notify.push(notify._id);
          await commentDone.save();
          post.comments.push(commentDone._id);
          await post.save();
          console.log("comment on self post with mention");
          return res.status(200).json({
            success: true,
            Comment: commentDone,
            message: "Comment done successfully",
          });
        } else {
          const commentDone = await Comment.create({
            item: post._id,
            sender: req.user._id,
            comment,
          });

          post.comments.push(commentDone._id);
          await post.save();
          console.log("comment on self post with out mention");
          return res.status(200).json({
            success: true,
            Comment: commentDone,
          });
        }
      }
    } else {
      if (cmnt) {
        if (cmnt.sender.toString() === req.user._id.toString()) {
          if (mentions.length > 0) {
            const commentDone = await Comment.create({
              item: post._id,
              sender: req.user._id,
              repliesOf: cmnt._id,
              comment,
            });

            const notification1 = {
              message: "Mentioned you in the comment",
              item: commentDone._id,
              itemModel: "Comment",
              sender: req.user._id,
              receiver: [...mentions],
            };
            const notify1 = await Notification.create(notification1);
            commentDone.notify.push(notify1._id);
            await commentDone.save();
            return res.status(200).json({
              success: true,
              Comment: commentDone,
              message: "Comment done successfully",
            });
          } else {
            const commentDone = await Comment.create({
              item: post._id,
              sender: req.user._id,
              repliesOf: cmnt._id,
              comment,
            });
            const notification = await Notification.create({
              sender: req.user._id, 
              receiver: [post?.owner],
              message: "Commented on your post",
              itemModel: "Comment",
              item: commentDone?._id,
            })
            commentDone.notify.push(notification._id);
            await commentDone.save();

            cmnt.reply.push(commentDone._id);
            await cmnt.save();
            console.log(
              "comment reply on others post on without mention of self reply"
            );
            return res.status(200).json({
              success: true,
              Comment: commentDone,
              message: "Comment done successfully",
            });
          }
        } else {
          if (mentions.length > 0) {
            const commentDone = await Comment.create({
              item: post._id,
              sender: req.user._id,
              repliesOf: cmnt._id,
              comment,
              mention: [...mentions],
            });
            const notification1 = {
              message: "Commented on your post",
              item: cmnt._id,
              itemModel: "Comment",
              sender: req.user._id,
              receiver: [post.owner],
            };
            const notification2 = {
              message: "Replied to your comment",
              item: cmnt._id,
              itemModel: "Comment",
              sender: req.user._id,
              receiver: [cmnt._id],
            };
            const notification3 = {
              message: "Mentioned you in the comment",
              item: cmnt._id,
              itemModel: "Comment",
              sender: req.user._id,
              receiver: [...mentions],
            };
            const notify1 = await Notification.create(notification1);
            const notify2 = await Notification.create(notification2);
            const notify3 = await Notification.create(notification3);
            commentDone.notify.push(notify1._id);
            commentDone.notify.push(notify2._id);
            commentDone.notify.push(notify3._id);
            await commentDone.save();
            cmnt.reply.push(commentDone._id);
            await cmnt.save();
            console.log(
              "comment reply on others post without on other reply with  metion"
            );
            return res.status(200).json({
              success: true,
              Comment: commentDone,
              message: "Comment done successfully",
            });
          } else {
            const commentDone = await Comment.create({
              item: post._id,
              sender: req.user._id,
              repliesOf: cmnt._id,
              comment,
            });
            const notification1 = {
              message: "Commented on your post",
              item: cmnt._id,
              itemModel: "Comment",
              sender: req.user._id,
              receiver: [post.owner],
            };
            const notification2 = {
              message: "Replied to your comment",
              item: cmnt._id,
              itemModel: "Comment",
              sender: req.user._id,
              receiver: [cmnt._id],
            };
            const notify1 = await Notification.create(notification1);
            const notify2 = await Notification.create(notification2);
            commentDone.notify.push(notify1._id);
            commentDone.notify.push(notify2._id);
            await commentDone.save();
            cmnt.reply.push(commentDone._id);
            await cmnt.save();
            console.log(
              "comment reply on others post without on other reply without reply"
            );
            return res.status(200).json({
              success: true,
              Comment: commentDone,
              message: "Comment done successfully",
            });
          }
        }
      } else {
        if (mentions.length > 0) {
          const commentDone = await Comment.create({
            item: post._id,
            sender: req.user._id,
            comment,
            mention: [...mentions],
          });
          const notification1 = await Notification.create({
            message: "Mention you in the comment",
            item: commentDone._id,
            itemModel: "Comment",
            receiver: [...mentions],
            sender: req.user._id,
          });
          const notification2 = await Notification.create({
            item: post._id,
            itemModel: "Post",
            message: "Commented on your post",
            sender: req.user._id,
            receiver: [post.owner],
          });
          commentDone.reply.push(notification1._id);
          commentDone.reply.push(notification2._id);
          await commentDone.save();
          post.comments.push(commentDone._id);
          await post.save();
          console.log("comment done on others pic with mention");
          return res.status(200).json({
            success: true,
            Comment: commentDone,
            message: "Comment done successfully",
          });
        } else {
          const commentDone = await Comment.create({
            item: post._id,
            sender: req.user._id,
            comment,
          });
          const notify = await Notification.create({
            message: "Commented on your post",
            itemModel: "Comment",
            item: commentDone._id,
            sender: req.user._id,
            receiver: [post.owner],
          });
          commentDone.notify.push(notify._id);
          commentDone.save();
          post.comments.push(commentDone);

          await post.save();
          console.log("comment done on others pic without mention");
          return res.status(200).json({
            success: true,
            Comment: commentDone,
          });
        }
      }
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.likeAndUnlikeCommment = async (req, res) => {
  try {
    const cmnt = await Comment.findById(req.params.id).populate("likes");
console.log(cmnt)
    if (!cmnt) {
      return res.status(400).json({
        success: false,
        message: "Comment not found",
      });
    }
    var index = -1;
    const likedByMe = cmnt.likes.find((like, key) => {
      if (like.user.toString() === req.user._id.toString()) {
        index = key;
        return like;
      }
    });

    if (likedByMe) {
      await Notification.findByIdAndDelete(likedByMe.notify);
      await Like.findByIdAndDelete(likedByMe._id);
      cmnt.likes.splice(index, 1);
      await cmnt.save();
      return res.status(200).json({
        success: true,
        message: "Unliked successfully",
      });
    } else {
      const like = {
        user: req.user._id,
        item: cmnt._id,
        itemType: "Comment",
        post : cmnt.item
       
      };
      const liked = await Like.create(like);
      if (cmnt.sender.toString() !== req.user._id.toString()) {
        const notify = await Notification.create({
          message: "Liked your comment",
          sender: req.user._id,
          receiver: [cmnt.sender],
          item: liked._id,
          itemModel: "Like",
        });
        liked.notify = notify._id;

        await liked.save();
      }

      cmnt.likes.push(liked._id);
      await cmnt.save();
      res.status(200).json({
        success: true,
        message: "Liked comment successfully",
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.likedPost = async (req, res) => {
  try {
    const likes = await Like.find({
      user: req.user._id,
      itemType: "Post",
    });
    var posts = [];
    await Promise.all(
      likes.map(async (like) => {
        const post = await Post.findById(like.item)
          .populate("owner")
          .populate({
            path: "likes",
            populate: {
              path: "user",
            },
          })
          .populate({
            path: "comments",
            populate: {
              path: "sender",
            },
          });
        posts.push(post);
      })
    );

    return res.status(200).json({
      success: true,
      likes: posts,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
exports.commentedPost = async (req, res) => {
  try {
    const comments = await Comment.find({
      sender: req.user._id,
    });

    var posts = [];
    await Promise.all(
      comments.map(async (like) => {
        const post = await Post.findById(like.item)
          .populate("owner")
          .populate({
            path: "likes",
            populate: {
              path: "user",
            },
          })
          .populate({
            path: "comments",
            populate: {
              path: "sender",
            },
          });
        if (post !== null) {
          
          posts.push(post);
        }
      })
    );

    return res.status(200).json({
      success: true,
      comments: posts,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
