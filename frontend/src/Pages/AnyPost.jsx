import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { anypost } from '../Redux/Actions/Post';
import Post from '../Component/Post/Post';
import { Spin } from 'antd';

const AnyPost = () => {
  const param = useParams();
  const dispatch = useDispatch();
  const post = useSelector((state) =>(state?.anyPost))  
  const getPost = async() => {
    try{
    await dispatch(anypost(param.id))

    }catch(e){
      console.log(e)
    }
  }
  useEffect(() =>{
    getPost();
  },[])
  return (
    <div className='scrollbar' style={{ height: "93vh", overflow: "scroll" }}>
      
      {
        
        post.loading ?
          <div className='center'>
            <Spin size={ 222} />

            </div> :

      <Post postDetails ={post?.post}/>
      }
      


    </div>
  )
}

export default AnyPost