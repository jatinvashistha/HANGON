import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Posts from '../Component/Posts/Posts'
import { Typography } from 'antd'
import { liked } from '../Redux/Actions/Post'
import { checkBlockedUser, checkBlockingYou } from '../Middleware'

const LikedPost = () => {
  const user = useSelector(state => state.user);
  const { likedPost } = useSelector((state) => (state?.likedPosts))
  const dispatch = useDispatch();
  const likePostt = async () => {
    try {
  await dispatch(liked())
    } catch (e) {
      console.log(e,'the errror is ')
    }
  }
  useEffect(() => {
    likePostt();
  },[])
  

  return (
    <>
      <Typography.Title
      style = {{ color :"white", padding : "30px"}}
      >Liked Posts </Typography.Title>
      <div className='UserPost center'>
        {likedPost?.length > 0 ? (
          <>
            {likedPost?.map(post => (
              post !== null &&
              <>
                {
                  !checkBlockedUser(user.user, post?.owner) && !checkBlockingYou(user.user, post?.owner) && <Posts
                    key={post._id}
                    username={post?.owner?.username}
                    image={post.imageUrl}
                    postId={post._id}
                    name={post.name}
                    owner={post.owner}
                    comments={post.comments}
                    likes={post.likes}
                  />



                }



              </>
            )).reverse()

            }
          </>
        ) : (
            <Typography.Title
              className='center'
              style={{ color: "white", padding: "30px", width: "100vw", height: "30vh" }}


            >No Such Post </Typography.Title>
        )}
      </div>
      
      </>
  )
}

export default LikedPost