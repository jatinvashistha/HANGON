import { Avatar, Card, Image, Space, Typography, message } from 'antd'
import React, { useEffect, useState } from 'react'
import UserList from '../UserList/UserList'
import { CommentOutlined, DeleteRowOutlined, HeartFilled, MoreOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { getFollowingPosts, likeAndUnlikePosts } from '../../Redux/Actions/Post'
import { useNavigate } from 'react-router-dom'
import { socket } from '../../Socket'
import { fileType } from '../../Middleware'
import './Posts.css'

const Posts = (
  {
  username,
    postId,
    name,image,
    owner,
    likes,
    comments 
  }

  ) => {
    const navigate = useNavigate();
    const [liked,setLiked] = useState(false);

    const [likesCount, setLikesCount] = useState(likes && likes.length > 0 ? likes.length : 0);

    const dispatch = useDispatch();
    const {user }= useSelector((state) =>(state.user))
    const handleLiked = async () => {
      try {

        await dispatch(likeAndUnlikePosts(postId));
        // socket.emit('notify')
        setLiked(!liked);

        if(liked) {
          setLikesCount(likesCount -1)
        }
        else {
          setLikesCount(likesCount + 1)

          message.success('Post liked successfully!');
        }
      } catch (error) {
        console.error('Error liking post:', error);
        message.error('Failed to like the post. Please try again.');
      }
    };
    useEffect(() =>{
      likes?.forEach((item) =>{
       
        if(item?._id == user?._id) {
          setLiked(true);
        }
      })

    },[likes,user])
    const handleNavigate = () =>{
      navigate(`/anypost/${postId}`)

    }
    
   

  return (
    <div>
      <div   onClick={handleNavigate}  theme="dark" className='posts cover'
    >
       {
                                                        fileType(image?.url) == "image" && <img className='postsImage'  src = {image?.url} />
                                                    }
                                                    {
                                                        fileType(image?.url) == "video" &&   
                                                        
                                                        <video className='postsImage'  controls >
                                                        <source src= {image?.url} type="video/mp4" />
                                                      </video>
                                                
                                                    }
      </div>
    </div>
  )
}

export default Posts