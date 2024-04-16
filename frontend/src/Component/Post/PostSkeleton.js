import {
  CheckOutlined,
  CloseOutlined,
  CommentOutlined,
  DeleteFilled,
  MoreOutlined,
  RetweetOutlined,
  SendOutlined,
  SketchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Collapse,
  Dropdown,
  Image,
  Input,
  List,
  Menu,
  Modal,
  Skeleton,
  Space,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { IoCheckbox, IoCheckboxOutline } from "react-icons/io5";
import { Mention, MentionsInput } from "react-mentions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fileType } from "../../Middleware";

import {
  addComment,
  anypost,
  changeCaption,
  commentDelete,
  deletePost,
  getFollowingPosts,
  interestedPost,
  likeAndUnlikeComment,
  likeAndUnlikePosts,
  savePost,
} from "../../Redux/Actions/Post";
import { BsBookmarkPlus, BsFillBookmarkCheckFill } from "react-icons/bs";
import { followAndUnfollow, loadUser } from "../../Redux/Actions/User";
import { socket } from "../../Socket";
import CommentReply from "../CommentReply/CommentReply";
import SendPost from "../SendPost/SendPost";
import UserList from "../UserList/UserList";
import { formatDistanceToNow } from "date-fns";
import "./Post.css";
import { MdDelete } from "react-icons/md";
import MentionStyle from "./mentionStyle";
import Paragraph from "antd/es/typography/Paragraph";
const { Panel } = Collapse;

const PostSkeleton = ({ postDetails }) => {
  const param = useParams();
  const [post, setPost] = useState({});
  const postDetail = useSelector((state) => state?.anyPost);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [isCommentsCollapsed, setCommentsCollapsed] = useState(true);
  const { user } = useSelector((state) => state.user);
  const [liked, setLiked] = useState(false);
  const [likedComment, setLikedComment] = useState({});
  const [saved, setSaved] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [editingCaption, setEditingCaption] = useState(false);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState(post?.post?.caption);
  const [reply, setReply] = useState({});
  const [replyInput, setReplyInput] = useState("");
  const [mention, setMention] = useState([]);
  const dispatch = useDispatch();
  const [interstedPost, setInterstedPost] = useState(false);
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    postDetails?.post?.comments.forEach((comment) => {
      postDetails?.comments?.forEach((comments) => {
        if (comments?._id.toString() === comment?._id.toString()) {
          setCommentList([...commentList, comments]);
        }
      });
    });
  }, [postDetails]);

  useEffect(() => {
    postDetails?.comments?.map((comment) => {
      comment?.likes.map((item) => {
        if (item?.user?._id.toString() === user?._id?.toString()) {
          setLikedComment((prev) => ({
            ...prev,
            [comment?._id]: true,
          }));
        }
      });
    });
  }, [postDetails]);

  useEffect(() => {
    setPost(postDetails);
  }, [postDetails]);
  useEffect(() => {
    if (param.id) {
      setPost(postDetail.post);
    }
  }, [postDetail]);
  let commentId = "";

  const getPost = async () => {
    try {
      if (param.id) {
        await dispatch(anypost(param.id));
      } else {
        dispatch(getFollowingPosts());
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getPost();
  }, []);
  const handleToggleComments = () => {
    setCommentsCollapsed(!isCommentsCollapsed);
  };

  const handleLiked = async (e) => {
    e.preventDefault();
    try {
      setLiked(!liked);
      await dispatch(likeAndUnlikePosts(post?.post?._id));
      await dispatch(anypost(param.id));
      // socket.emit('notify')
      dispatch(getFollowingPosts());
    } catch (error) {
      console.error("Error liking post:", error);
      message.error("Failed to like the post. Please try again.");
    }
  };
  const handleCommentLiked = async (commentId) => {
    try {
      setLikedComment((prev) => ({
        ...prev,
        [commentId]: ![commentId],
      }));

      await dispatch(likeAndUnlikeComment(post?._id, commentId));
      await dispatch(anypost(param.id));
      dispatch(getFollowingPosts());
      // socket.emit('notify')
    } catch (error) {
      console.error("Error liking post:", error);
      message.error("Failed to like the post. Please try again.");
    }
  };
  const handlCancelReply = (id) => {
    setReply((prev) => ({
      ...prev,
      [id]: false,
    }));
    setReplyInput("");
  };
  const handleReply = (id) => {
    setReply((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

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
        message.success("Saved successfully");
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
        message.success("Saved successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleFollow = async (id) => {
    try {
      await dispatch(followAndUnfollow(id));
      await dispatch(loadUser());
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    post?.post?.likes?.forEach((item) => {
      if (item?.user?._id == user?._id) {
        setLiked(true);
        return;
      } else {
        setLiked(false);
      }
    });
  }, [post?.likes, post?.user, post?.comments, user]);

  useEffect(() => {
    user?.savedPost?.forEach((item) => {
      if (item?._id === post?.post?._id) {
        setSaved(true);
      }
    });
  }, [post, user]);

  useEffect(() => {
    user?.interestedPost?.forEach((item) => {
      if (item?._id === post?.post?._id) {
        setInterstedPost(true);
      }
    });
  }, [post, user]);

  useEffect(() => {
    setCaption(post?.post?.caption);
  }, [post]);

  const addCommentt = async () => {
    if (commentInput.trim() === "") {
      message.warning("Please enter a comment.");
      return;
    }
    setCommentInput("");
    try {
      const x = JSON.stringify(mention);
      await dispatch(addComment(post?.post?._id, commentInput, x, commentId));
      await getPost();
      message.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      message.error("Failed to add comment. Please try again.");
    }
  };

  const addCommentReply = async (id) => {
    if (replyInput.trim() === "") {
      message.warning("Please enter a comment.");
      return;
    }
    setReplyInput("");
    try {
      const x = JSON.stringify(mention);
      await dispatch(addComment(post?.post?._id, replyInput, x, id));
      await dispatch(anypost(param.id));
      await dispatch(getFollowingPosts());

      message.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      message.error("Failed to add comment. Please try again.");
    }
  };

  const handleChangeCaption = async () => {
    try {
      setLoading(true);

      await dispatch(changeCaption(post?.post?._id, caption));
    } catch (e) {
      console.log(e);
    } finally {
      setEditingCaption(false);
      setLoading(false);
    }
  };
  const handleDeletePost = async () => {
    try {
      const id = post?.owner?._id;
      await dispatch(deletePost(post?._id));
      navigate(`/user/${id}`);
    } catch (e) {
      console.log(e);
    }
  };
  const deleteComment = async (id, postId) => {
    try {
      console.log("post", postId);
      await dispatch(commentDelete(post?.post?._id, id));
      await dispatch(anypost(param.id));
      await dispatch(getFollowingPosts());
    } catch (e) {
      console.log(e);
    }
  };

  const handleTextareaChange = (e) => {
    setCaption(e.target.value);
    const rows = Math.ceil(e.target.value.length / 32);
    e.target.rows = rows;
  };
  function extractMentionUserIds(value) {
    const mentionRegex = /@(\w+)/g;
    const matches = value.match(mentionRegex);
    if (matches) {
      return matches.map((match) => match.substring(1));
    }
    return [];
  }

  return (
    <div className="post">
      <Card bodyStyle={{ padding: "0" }} hoverable className="postCard">
        <Card.Meta
          className="nameUsernameSection center"
          avatar={<Skeleton.Avatar size={40} className="postAvatar" />}
          description={
            <div className="center">
              <Space>
                {!(user?._id === post?.post?.owner?._id) && (
                  <>
                    {!user?.following?.some(
                      (element) => element.user?._id === post?.post?.owner?._id
                    ) ? (
                      <Skeleton.Button
                        type="primary"
                        onClick={() => {
                          handleFollow(post?.post?.owner?._id);
                        }}
                        className="followButton button"
                        icon={<UserAddOutlined />}
                      >
                        Follow
                      </Skeleton.Button>
                    ) : (
                      <Skeleton.Button
                        onClick={() => {
                          handleFollow(post?.post?.owner?._id);
                        }}
                        className="followButton button"
                        icon={<CheckOutlined />}
                      >
                        Following
                      </Skeleton.Button>
                    )}
                  </>
                )}
              </Space>
            </div>
          }
        />
        <Card
          className=""
          style={{ border: "none" }}
          cover={
            fileType(post?.post?.imageUrl?.url) === "image" ? (
              <Skeleton.Input
                active
                style={{ width: "100%", height: "300px" }}
              />
            ) : (
              <Skeleton.Input
                active
                style={{ width: "100%", height: "300px" }}
              />
            )
          }
          actions={[
            <Skeleton.Button active />,
            <Skeleton.Button active />,
            <Skeleton.Button active />,
            <Skeleton.Button active />,
          ]}
        ></Card>

        <div>
          <Collapse
            onChange={handleToggleComments}
            activeKey={isCommentsCollapsed ? [] : ["1"]}
          >
            <Panel
              key="1"
              style={{ border: "none" }}
              className="custom"
              header={
                <div>
                  <Typography style={{ marginBottom: "4px" }}>
                    Comments
                  </Typography>
                  <div className="commentPannel center">
                    <Skeleton.Input
                      style={{ width: "100%" }}
                      placeholder="Enter the Comment"
                    />
                    <Skeleton.Button>
                      <SendOutlined />
                    </Skeleton.Button>
                  </div>
                </div>
              }
            >
              <List>
                <Skeleton.Input active />
        
              </List>
            </Panel>
          </Collapse>
        </div>
      </Card>
    </div>
  );
};

export default PostSkeleton;
