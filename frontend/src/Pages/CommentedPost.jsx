import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Posts from '../Component/Posts/Posts'
import { Typography } from 'antd'
import { commented, liked } from '../Redux/Actions/Post'
import { checkBlockedUser, checkBlockingYou } from '../Middleware'

const CommentedPost = () => {
  const { commentedPost } = useSelector((state) => (state?.commentedPost))
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const commentedPostt = async () => {
    try {
      await dispatch(commented())
    } catch (e) {
      console.log(e, 'the errror is ')
    }
  }
  useEffect(() => {
    commentedPostt();
  }, [])


  return (
    <>
      <Typography.Title
        style={{ color: "white", padding: "30px" }}
      
      
      >Commented Posts </Typography.Title>
      <div className='UserPost center'>
        {commentedPost?.length > 0 ? (
          <>
            
            {commentedPost?.map(post => (
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
              style={{ color: "white", padding: "30px" ,width : "100vw", height : "30vh"}}


            >No Such Post </Typography.Title>
        )}
      </div>

    </>
  )
}

export default CommentedPost