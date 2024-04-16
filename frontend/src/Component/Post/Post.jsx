import { CheckOutlined, CloseOutlined, CommentOutlined, DeleteFilled, MoreOutlined, RetweetOutlined, SendOutlined, SketchOutlined, UserAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Collapse, Dropdown, Image, Input, List, Menu, Modal, Space, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { IoCheckbox, IoCheckboxOutline } from "react-icons/io5";
import { Mention, MentionsInput } from 'react-mentions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fileType } from '../../Middleware';

import { addComment, anypost, changeCaption, commentDelete, deletePost, getFollowingPosts, interestedPost, likeAndUnlikeComment, likeAndUnlikePosts, savePost } from '../../Redux/Actions/Post';
import { BsBookmarkPlus, BsFillBookmarkCheckFill } from "react-icons/bs";
import { followAndUnfollow, loadUser } from '../../Redux/Actions/User';
import { socket } from '../../Socket';
import CommentReply from '../CommentReply/CommentReply';
import SendPost from '../SendPost/SendPost';
import UserList from '../UserList/UserList';
import { formatDistanceToNow } from 'date-fns';
import './Post.css';
import { MdDelete } from "react-icons/md";
import MentionStyle from './mentionStyle';
import Paragraph from 'antd/es/typography/Paragraph';
const { Panel } = Collapse;

const Post = (
  { postDetails }
) => {
  const param = useParams();
  const [post, setPost] = useState({})
  const postDetail = useSelector((state) => (state?.anyPost))
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [isCommentsCollapsed, setCommentsCollapsed] = useState(true);
  const { user } = useSelector((state) => (state.user))
  const [liked, setLiked] = useState(false);
  const [likedComment, setLikedComment] = useState({});
  const [saved, setSaved] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [editingCaption, setEditingCaption] = useState(false);
  const [loading, setLoading] = useState(false)
  const [caption, setCaption] = useState(post?.post?.caption);
  const [reply, setReply] = useState({});
  const [replyInput, setReplyInput] = useState("");
  const [mention, setMention] = useState([])
  const dispatch = useDispatch();
  const [interstedPost, setInterstedPost] = useState(false);
  const [commentList, setCommentList] = useState([])

  useEffect(() => {
    
    postDetails?.post?.comments.forEach((comment) => {
    
      postDetails?.comments?.forEach((comments) => {
        if (comments?._id.toString() === comment?._id.toString()) {
          
          setCommentList([...commentList,comments])
        }
      })
      
    })
  
  }, [postDetails])
  


  useEffect(() => {
    postDetails?.comments?.map((comment) => {
     comment?.likes.map((item) => {
       if (item?.user?._id.toString() === user?._id?.toString()) {
         setLikedComment((prev) => (
           {
             ...prev, [comment?._id]: true
           }
         ))
          
        }
      }) 
    })
    
  }, [postDetails])




  useEffect(() => {
    setPost(postDetails)
  }, [postDetails])
  useEffect(() => {
    if (param.id) {
      setPost(postDetail.post)
    }
  }, [postDetail])
  let commentId = "";

  const getPost = async () => {
    try {
      if (param.id) {

        await dispatch(anypost(param.id))

      }
      else {
        dispatch(getFollowingPosts());
      }

    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    // getPost();
  }, [])
  const handleToggleComments = () => {
    setCommentsCollapsed(!isCommentsCollapsed);
  }

  const handleLiked = async (e) => {
    e.preventDefault();
    try {
      setLiked(!liked);
      await dispatch(likeAndUnlikePosts(post?.post?._id));
      await dispatch(anypost(param.id))
      // socket.emit('notify')
      dispatch(getFollowingPosts());
    } catch (error) {
      console.error('Error liking post:', error);
      message.error('Failed to like the post. Please try again.');
    }
  };
  const handleCommentLiked = async (commentId) => {

    try {
      setLikedComment(
        prev => (
          {
            ...prev,
            [commentId]: ![commentId]
          }
        )
      )

      await dispatch(likeAndUnlikeComment(post?._id, commentId));
      await dispatch(anypost(param.id))
      dispatch(getFollowingPosts());
      // socket.emit('notify')
    } catch (error) {
      console.error('Error liking post:', error);
      message.error('Failed to like the post. Please try again.');
    }
  };
  const handlCancelReply = (id) => {
    setReply(prev =>
    ({
      ...prev,
      [id]: false
    }
    ))
    setReplyInput('')
  }
  const handleReply = (id) => {
    setReply(prev => ({
      ...prev,
      [id]: true
    }))
  }




  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {

    setVisible(false);
  };

  const handleCancel = () => {

    setVisible(false);
  };
  const handleSaved = async (e) => {
    e.preventDefault();
    try {
      setSaved(!saved);
      await dispatch(savePost(post?.post?._id));
      dispatch(getFollowingPosts());
      if (!saved) {
        message.success('Saved successfully');
      }
    } catch (error) {
      console.error(error);

    }
  };
  const handleInterested = async (e) => {
    e.preventDefault();
    try {
      setInterstedPost(!interstedPost);
      await dispatch(interestedPost(post?.post?._id));
      dispatch(getFollowingPosts());
      if (!saved) {
        message.success('Saved successfully');
      }
    } catch (error) {
      console.error(error);

    }
  };
  const handleFollow = async (id) => {
    try {
      await dispatch(followAndUnfollow(id))
      await dispatch(loadUser());
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    post?.post?.likes?.forEach((item) => {
      if (item?.user?._id == user?._id) {
        setLiked(true);
        return
      }
      else {
        setLiked(false);
      }
    })
  }, [post?.likes, post?.user, post?.comments, user])


  useEffect(() => {
    user?.savedPost?.forEach((item) => {
      if (item?._id === post?.post?._id) {
        setSaved(true)
      }
    })
  }, [post,user])

  useEffect(() => {
    user?.interestedPost?.forEach((item) => {
      if (item?._id === post?.post?._id) {
        setInterstedPost(true)
      }
    })
  }, [post,user])


  useEffect(() => {
    setCaption(post?.post?.caption)
  }, [post])

  const addCommentt = async () => {
    if (commentInput.trim() === '') {

      message.warning('Please enter a comment.');
      return;
    }
    setCommentInput('');
    try {
      const x = JSON.stringify(mention);
      await dispatch(addComment(post?.post?._id, commentInput, x, commentId));
      await getPost();
      message.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      message.error('Failed to add comment. Please try again.');
    }
  };

  const addCommentReply = async (id) => {
    if (replyInput.trim() === '') {

      message.warning('Please enter a comment.');
      return;
    }
    setReplyInput('');
    try {
      const x = JSON.stringify(mention);
      await dispatch(addComment(post?.post?._id, replyInput, x, id));
      await dispatch(anypost(param.id))
      await dispatch(getFollowingPosts());

      message.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      message.error('Failed to add comment. Please try again.');
    }
  };


  const handleChangeCaption = async () => {
    try {
      setLoading(true)

      await dispatch(changeCaption(post?.post?._id, caption))

    } catch (e) {
      console.log(e);
    }
    finally {
      setEditingCaption(false);
      setLoading(false);
    }
  }
  const handleDeletePost = async () => {
    try {
      
      await dispatch(deletePost(param.id))
      await dispatch(loadUser());
      navigate(`/`)

    } catch (e) {
      console.log(e);
    }
  }
  const deleteComment = async (id, postId) => {
    try {
      console.log('post', postId)
      await dispatch(commentDelete(post?.post?._id, id));
      await dispatch(anypost(param.id))
      await dispatch(getFollowingPosts());
    } catch (e) {
      console.log(e);

    }
  }



  const handleTextareaChange = (e) => {
    setCaption(e.target.value);
    const rows = Math.ceil(e.target.value.length / 32);
    e.target.rows = rows;
  };
  function extractMentionUserIds(value) {
    const mentionRegex = /@(\w+)/g;
    const matches = value.match(mentionRegex);
    if (matches) {
      return matches.map(match => match.substring(1));
    }
    return [];
  }


  return (
    <div className='post'>
      <Card bodyStyle={{ padding: "0" }} hoverable className='postCard'>
        <Card.Meta

          className='nameUsernameSection center'
          avatar={<Avatar size={40} className='postAvatar' src={post?.post?.owner?.avatar?.url} />}
          description={
            <div className='center'>
              <Typography.Title
                onClick={() => {navigate(`/user/${post?.post?.owner?._id}`)}}
              
                className='center postUsername'>
                {post?.post?.owner?.username}
              </Typography.Title>
              <Space >

                {
                  !(user?._id === post?.post?.owner?._id) &&
                  <>
                    {
                      !user?.following?.some((element) => element.user?._id === post?.post?.owner?._id) ?
                        <Button type="primary" onClick={() => { handleFollow(post?.post?.owner?._id) }} className='followButton button' icon={<UserAddOutlined />}>Follow</Button>
                        : <Button onClick={() => { handleFollow(post?.post?.owner?._id) }} className='followButton button' icon={<CheckOutlined />}>Following</Button>
                    }</>

                }

                {
                  post?.post?.owner?._id === user?._id &&

                  <Dropdown overlay={<Menu>
                    <Menu.Item onClick={() => { setEditingCaption(true) }} >Change Caption</Menu.Item>
                    <Menu.Item onClick={() => { handleDeletePost() }}>Delete Post</Menu.Item>
                  </Menu>}>
                    <MoreOutlined class="menuIcon" />
                  </Dropdown>
                }
              </Space>
            </div>
          }
        />
        <Card className=''
          style={{ border: "" }}
          cover={fileType(post?.post?.imageUrl?.url) === "image" ? (
            <img className='postImage' src={post?.post?.imageUrl?.url} />
          ) : (
            <video controls width="180" height="200">
              <source src={post?.post?.imageUrl?.url} type="video/mp4" />
            </video>
          )}


          actions={[
            <div className='postActions  center'>
              <div className={`like-container ${liked ? 'liked' : ''}`} onClick={handleLiked}>
                {liked ?
                  <Button
                    type="link"
                    icon={<SketchOutlined style={{ fontSize: "20px" }} />}
                  />
                  : <SketchOutlined />


                }
              </div>
              <div >
                {
                  post?.post?.likes?.length > 0 &&
                  <UserList users={post?.post?.likes} value={post?.post?.likes?.length} />
                }
              </div>
            </div>,
            // <div className='postActions center'onClick={handleToggleComments}>
            //   <CommentOutlined style={{ paddingRight: '5px' }} ></CommentOutlined> {post?.comments?.length}
            // </div>,

            <div className='postActions center'
              onClick={handleInterested}
            
            >

              {
                interstedPost ? <RetweetOutlined style={{ color: "blue" }} /> : <RetweetOutlined style={{ color: "gray" }} />
              }

            </div>,
            <div className='postActions center' onClick={handleSaved}>
              {
                saved ? < BsFillBookmarkCheckFill style={{ color: "blue" }} /> : <BsBookmarkPlus />
              }

            </div>,
            <div className='postActions center'>
              <SendOutlined onClick={() => setVisible(true)} />
              <Modal
                footer={null}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}

              >
                <SendPost setVisible={setVisible} post={post?.post} />

              </Modal>
            </div>
          ]}
        >



          <Card.Meta

            // bodyStyle={{ padding: "0"}}
            description={
              <div className='captionSection'>
                {post?.post &&
                  <div className='postTime' >
                    

                    {post?.post?.createdAt && 
                      <>
                      
                    { 
                      formatDistanceToNow(new Date(post?.post?.createdAt))}
                      </>
                    }
                    ago
                  
                  
                  </div>
                
                }

                {
                  editingCaption ?
                    <>
                      <textarea
                        value={caption}
                        onChange={handleTextareaChange}

                        autoFocus
                      />
                      <Button loading={loading} type="primary" onClick={handleChangeCaption}
                        class="button"

                        style={{ marginTop: '8px' }}>
                        Save
                      </Button>
                    </> :
                    <>
                      {caption}

                    </>
                }
              </div>
            }
          />
        </Card>

        <div>
          <Collapse
            onChange={handleToggleComments}

            activeKey={isCommentsCollapsed ? [] : ['1']}>

            <Panel key="1"
              style={{ border: "none" }}
              className="custom"
              header={
                < div
                >
                  <Typography style={{ marginBottom: "4px" }} >
                    Comments {post?.comments?.length}
                  </Typography>
                  <div className='commentPannel center'>
                    <Input
                      placeholder='Enter the Comment'
                      style={{
                        borderRadius: "0 "
                      }}
                      value={commentInput}
                      onChange={(e) => { setCommentInput(e.target.value) }}
                    />
                    <Button type="primary" className="button"
                      onClick={addCommentt}
                    >
                      <SendOutlined />
                    </Button>
                  </div>
                </div>
              }
            >
              <List className='wholeComment' style={{ maxHeight: "300px", overflowY: 'scroll' }}>
                {post?.post?.comments?.length > 0 ?
                  <>   {post?.post?.comments.map((comment) =>
                  
                  {
                    const newCmnt = post?.comments?.find((item) => item?._id === comment?._id);
                    
    
                    return (

                    <>    <div className="commentList center">
                      <div bodyStyle={{ padding: "5px", border: "1px solid green" }} style={{ width: "100%", padding: "2px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}> <span
                            onClick={() => {
                              navigate(`/user/${comment?.sender?._id}`)

                        }}
                        
                          > <Avatar src={comment?.sender?.avatar?.url} /> @ {comment?.sender?.username}</span>
                          <div>
                            {
                              (post?.post?.owner?._id === user?._id || comment?.sender?._id === user?._id) && <MdDelete onClick={() => { deleteComment(comment?._id, post?.post?._id) }} />
                            }
                          </div>
                        </div>
                        <div bodyStyle={{ padding: "5px" }} style={{ width: "100%" }}>
                          <Paragraph
                            ellipsis={{ rows: 3, expandable: true, symbol: "show more" }}
                            className='Paragraph'
                            style={{ display: 'inline-block' }}
                          >
                            {comment?.comment}
                            </Paragraph>
                            <div className='postTime'
                              style={{ fontSize: '8px' }}
                            >


                              {post?.post?.createdAt &&
                                <>

                                  {
                                    formatDistanceToNow(new Date(post?.post?.createdAt))}

                                </>


                              }
                              ago


                            </div>


                        </div>
                        <div style={{ display: 'flex', width: "100%", flexDirection: "row", alignItems: 'center', justifyContent: !reply[comment?._id] ? "flex-start" : "space-between", padding: "0px 0px 0 0px" }}>
                          {likedComment[comment?._id] ?
                            <Button className='sketch' onClick={() => { handleCommentLiked(comment?._id) }}
                              type="link"
                              icon={<SketchOutlined />}
                            />
                            : <Button className='sketch' onClick={() => { handleCommentLiked(comment?._id) }}
                              style={{ border: 'none' }}
                              icon={<SketchOutlined />}
                            />
                          }
                          {
                            comment?.likes?.length > 0 ?
                              <UserList users={newCmnt?.likes} value={comment?.likes?.length} /> : "0"
                          }
                          <span>
                            {!reply[comment?._id] ?
                              <Button type="link" onClick={() => { handleReply(comment?._id) }} > Reply</Button>
                              : <span className='commentReply'>
                                <input type='text'
                                  value={replyInput}
                                  className="inputReply"
                                  // style={MentionStyle}
                                  onChange={(e, value) => {
                                    setReplyInput(e.target.value)
                                  }
                                  }
                                />

                                {/* <MentionsInput
                                  value={replyInput}
                                  style={MentionStyle}
                                  onChange={(e, value) => {
                                  
                                    const mentionUserIds = extractMentionUserIds(value);
                                    setReplyInput(value)
                                  }
                                  }
                                  placeholder="Reply here..."
                                  bodyStyle={{ border: "none" }}
                                >
                                  {
                                    user?.following.map((item) => {
                                      return (
                                        <Mention
                                          key={item?.user?._id}
                                          trigger="@"
                                          displayTransform={(id, display) => `@${display}`}
                                          data={[{
                                            id: item?.user?._id,
                                            display: item?.user?.name,
                                            profilePic: item?.user?.avatar?.url
                                          }]}
                                          renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
                                            <Space>
                                              <Avatar src={suggestion?.profilePic} alt="Profile" />
                                              {highlightedDisplay}
                                            </Space>
                                          )}
                                        />
                                      )
                                    })
                                  }
                                </MentionsInput> */}
                                <Button className='sketch' onClick={() => { handlCancelReply(comment?._id) }} style={{ border: "none" }} icon={<CloseOutlined />} />
                                <Button onClick={() => addCommentReply(comment?._id)} type="link" className='sketch' icon={<SendOutlined />} />
                              </span >
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                      <div style={{ display: "flex", width: "100%", flexDirection: 'column', justifyContent: "flex-end" }}>
                        {
                          comment?.reply?.length > 0 && comment?.reply?.map((comment) => {
                            const newComment = post?.comments?.find((item) => item?._id === comment);
                            return (
                              <div className="commentReplyPost" >
                                <div className='commentReplyPosts'>
                                  <CommentReply    
                                    likedComment={likedComment}
                                    setLikedComment = {setLikedComment}
                                    navigate={navigate} post={post} comment={newComment} />
                                </div>

                              </div>
                            )
                          })
                        }
                      </div>
                    </>
                  )
                  }
                  
                  ).reverse()
                  }</> :
                  <Typography style={{ color: "grey" }}>
                    No comments available
                  </Typography>
                }
              </List>
            </Panel>
          </Collapse>
        </div>
      </Card>
    </div>
  );
}

export default Post;
