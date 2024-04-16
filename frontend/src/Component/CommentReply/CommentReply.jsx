import { CloseOutlined, DeleteFilled, SendOutlined, SketchOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Input, List, Space, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addComment, anypost, commentDelete, getFollowingPosts, likeAndUnlikeComment } from '../../Redux/Actions/Post';
// import { anypost } from '../../../../backend/backend/controllers/Post';
import { socket } from '../../Socket';
import UserList from '../UserList/UserList';
import { MentionsInput } from 'react-mentions';
import mentionStyle from '../Post/mentionStyle';
import { useNavigate, useParams } from 'react-router-dom';
import { Mention } from 'react-mentions';
import { MdDelete } from 'react-icons/md';
import Paragraph from 'antd/es/typography/Paragraph';
import { formatDistanceToNow } from 'date-fns';

const CommentReply = ({
    comment, post , navigate,likedComment,setLikedComment
}) => {
   
    let commentId = "";
    const param = useParams();
    const [reply, setReply] = useState({});
    const [replyInput, setReplyInput] = useState("");
    const [mention, setMention] = useState([])
    const dispatch = useDispatch();
    const { user } = useSelector((state) => (state.user))
    const handlCancelReply = (id) => {
        setReply(prev =>
        ({
            ...prev,
            [id]: false
        }
        ))
        setReplyInput('')
    }
    const handleCommentLiked = async (commentId) => {

        try {
            setLikedComment(
                prev => (
                    {
                        ...prev,
                        // [commentId]: ![commentId]
                    }
                )
            )
           
            await dispatch(likeAndUnlikeComment(post?._id, commentId));
            await dispatch(anypost(param.id))
            dispatch(getFollowingPosts());
            socket.emit('notify')
        } catch (error) {
            console.error('Error liking post:', error);
            message.error('Failed to like the post. Please try again.');
        }
    };

    const handleReply = (id) => {
        setReply(prev => ({
            ...prev,
            [id]: true
        }))
    }
    function handleClick(match) {
        handlNavigate(match);
      }
    const handlNavigate = (match) =>{
        navigate('/user/${match[2]}')
    }
    function extractIDAndTextFormatted(text) {
        const regex = /\@\[([^\]]+)\]\(([^\)]+)\)/g;
        let newText = text;
        const ids = [];
        const names = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            names.push(match[1]);
            ids.push(match[2]);
            
const link = `<span>${match[1]}</span>`;

            newText = newText.replace(match[0], link);
        }
        return { ids, names, textWithoutID: newText.trim() };
    }
    
    // const text = "dafasdfafsfs @[Aryan Panchal](65c601b80f1a0da17f821411) adfaa @[Aryan Panchal](65c614a58faf9e4a32d1dc7c)aas' 'this is the world'";
    // const { ids, names, textWithoutID } = extractIDAndTextFormatted(text);
    // console.log(`Names: ${names}`);
    // console.log(`IDs: ${JSON.stringify(ids)}`);
    // console.log(`Text without IDs: ${textWithoutID}`);
    
    const deleteComment = async (id) => {
        try {
          await dispatch(commentDelete(post?.post?._id, id));
          await dispatch(anypost(param.id))
          await dispatch(getFollowingPosts());
        } catch (e) {
          console.log(e);
        }
      }

    const addCommentt = async (id) => {
        if (replyInput?.trim() === '') {
            message.warning('Please enter a comment.');
            return;
        }

        setReplyInput('');
        try {
    //    const data =   extractIDAndTextFormatted(replyInput)
            // console.log(data,'the data is ');
            await dispatch(addComment(post?.post?._id, replyInput, JSON.stringify([]), id));
            await dispatch(anypost(param.id))
            await dispatch(getFollowingPosts());
            message.success('Comment added successfully!');
        } catch (error) {
            console.error('Error adding comment:', error);
            message.error('Failed to add comment. Please try again.');
        }
    };
    return (
        <div>
            <List.Item style={{ display: 'flex', flexDirection: "column", alignItems: "flex-start", padding: "0", border: "none", margin: "5px", width: "100%" }}>
                <div style={{ width: "100%", padding: "2px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}> <span
                        onClick={() => {
                            navigate(`/user/${comment?.sender?._id}`)

                        }}

                    
                    > <Avatar src={comment?.sender?.avatar?.url} /> @ {comment?.sender?.username}</span>
                        
                        <div>
                        {
                                (post?.post?.owner?._id === user?._id || comment?.sender?._id === user?._id) &&   <MdDelete  onClick = {() =>{deleteComment(comment?._id)}} />

                      }
                        </div>
                    </div>
                    <div>
                        
                    
                        <Paragraph
                            ellipsis={{ rows: 3, expandable: true, symbol: "show more" }}
                            className='Paragraph'
                            style={{ display: 'inline-block' }}
                        >
                            <b
                                
                                onClick={() => {
                                    navigate(`/user/${comment?.repliesOf?.sender?._id}`)

                                }}

                                style={{ display: 'inline-block' }}>@{comment?.repliesOf?.sender?.username}</b> <br />{comment?.comment}
                        </Paragraph>
                        <div className='postTime'
                            style = {{ fontSize : '8px'}}
                        
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
                                icon={<SketchOutlined  className='sketch'/>}
                              />
                            : <Button className='sketch' onClick={() => { handleCommentLiked(comment?._id) }}
                                style={{ border: 'none' }}
                                icon={<SketchOutlined />}
                              />
                            }
                            {
                              comment?.likes?.length > 0 ? 
                              <UserList users={comment?.likes} value={comment?.likes?.length} /> : "0"
                            }
                        <span>
                            {!reply[comment?._id] ?
                                <Button type="link" onClick={() => { handleReply(comment?._id) }} > Reply</Button>
                                : <span style={{ display: 'grid', gridTemplateColumns: "10fr 1fr 1fr", alignItems: 'center', justifyContent: 'center', marginLeft: "10px" }}>
                                    
                                    <input
                                        className='inputReply'
                                        
                                        value={replyInput} placeholder="Reply here..."
                                        bodyStyle={{ border: "none" }}
                                        onChange={(e, value) => {
                                            setReplyInput(e.target.value)

                                        }
                                        }
                                    />
                                    {/* <MentionsInput
                                        value={replyInput}
                                       
                                      
                                    
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
                                    <Button type="link" onClick = {() => {addCommentt(comment?._id)}} icon={<SendOutlined />} />
                                </span >
                            }
                        </span>
                    </div>
                </div>
            </List.Item>
            <div style={{ display: "flex", width: "100%", flexDirection: 'column', justifyContent: "flex-end" }}>
                        {
                          comment?.reply?.length > 0 && comment?.reply?.map((comment) => {
                            const newComment = post?.comments?.find((item) => item?._id === comment);
                            return (
                              <div    >
                                    <CommentReply
                                        likedComment={ likedComment}
                                        setLikedComment={setLikedComment}
                                        navigate={navigate} post={post} comment={newComment} />
                              </div>
                            )
                          })
                        }
                      </div>
        </div>
    )
}

export default CommentReply