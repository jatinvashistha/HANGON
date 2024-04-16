import React, { useEffect, useState } from 'react'
import Post from '../Component/Post/Post'
import User from '../Component/User/User'
import { useDispatch, useSelector } from "react-redux";
import { getFollowingPosts } from '../Redux/Actions/Post';
import { getAllUsers } from '../Redux/Actions/User';
import { Avatar, Button, Col, Input, Layout, List, Modal, Row } from 'antd';
import Example from '../Component/Example';
import Sider from 'antd/es/layout/Sider';
import { ListConsumer } from 'antd/es/list/context';
import { Header } from 'antd/es/layout/layout';
import { CiImageOff } from 'react-icons/ci';
import { FileImageOutlined } from '@ant-design/icons';
import Newpost from './Newpost';
import '../PagesCss/Home.css'
import SendPost from '../Component/SendPost/SendPost';
const Home = () => {


  const dispatch = useDispatch();
  const data = useSelector((state) => (state?.post))
  const [visible, setVisible] = useState(false);
  const { user } = useSelector(state => state?.user)

  useEffect(() => {
    dispatch(getFollowingPosts());
    dispatch(getAllUsers());
  }, [])
  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    console.log('Clicked OK');
    setVisible(false);
  };

  const handleCancel = () => {
    console.log('Clicked cancel');
    setVisible(false);
  };

  return (
    <div className='homeRow scrollbar'>
      

      <Col xs={24} sm={23} md={16} lg={16} xl={10} className=' homeSection center'>
          <div className='colHeader glass' >
            <Avatar  className='newPostItem newPostAvatar' src={user?.avatar?.url} size={33} />
          <Input className='newPostItem fileInput' onClick={showModal} value={""} placeholder='Tap to post...' />
          <FileImageOutlined
            className='newPostItem newPostAvatar'
            onClick={showModal} style={{ color: "white", fontSize: "30px", }} >
          </FileImageOutlined >
            
          
        </div>

        <Modal
          footer={null}
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Newpost setVisible={setVisible} />

        </Modal>
          <div className="scrollbar homePost" >


            {data?.loading ? (
              <>Loading</>
            ) : data?.posts && data?.posts?.length > 0 ? (
              <div className='postItems' >

                {data.posts.map((post, key) => {
      
                  return (
                    <div  >
                      <Post
                        postDetails={post}
                      />

                    </div>
                  )
                }

                )}
              </div>
            ) : (
              <div>
                <List>
                </List>
              </div>
            )}
          </div>

        </Col>
      


    </div>
  )
}

export default Home