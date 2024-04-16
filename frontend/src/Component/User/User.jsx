import { Avatar, Button, Card, Divider, Space, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { anyUser } from '../../Redux/Actions/User';
import { UsergroupAddOutlined } from '@ant-design/icons';
import UserList from '../UserList/UserList';
import Posts from '../Posts/Posts';
import AccountModal from '../AccountModal/AccountModal';
 
const User = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
 
  const {user} = useSelector((state) =>(state.anyUser))  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(anyUser(params.id));
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
  
    fetchData();
  }, [params.id, dispatch]);
  return (
    <div>
      <Card style={{ width: "auto", margin: 'auto', marginTop: "2vmax" }}>
        <div style={{ display: 'flex' }} >
          <Avatar size={128} src={user?.avatar?.url} />

          <div style={{ margin: "10px 40px" }}>
            <Typography style={{ fontSize: "30px" }}>{user?.name}</Typography>
            <Typography style={{ fontSize: "18px",marginTop :"-6px" }}>@{user?.username}</Typography>
            <Typography.Paragraph>{user?.bio}</Typography.Paragraph>
          </div>
        </div>
        <Divider/>
        <div style={{ display: 'flex', alignItems: "center", justifyContent: 'space-around', width  :"70%" , margin :"auto" ,}}>
            <div


              style={{ marginLeft: '10px', width: "auto", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: "center" }}
            >

              <Typography style={{ fontSize: "22px", textAlign: 'center' }}> {user?.posts?.length}</Typography>
              <Typography style={{ fontSize: "17px", textAlign: 'center' }}>Posts</Typography>
              {/* 
<UserList users={user.following} value={user.following.length} /> */}
            </div>
            <Divider type="vertical" style={{ height: '60px' }} />
            <div
              style={{ marginLeft: '10px', width: "auto", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: "center" }} type="default"
            >

              <UserList sizee={true} users={user?.followers} value={user?.followers.length} />
              <Typography style={{ fontSize: "17px" }}>Followers </Typography>
            </div>
            <Divider type="vertical" style={{ height: '60px' }} />
            <div

              type="default"
              style={{ marginLeft: '10px', width: "auto", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: "center" }}            >
              <UserList sizee={true} users={user?.following} value={user?.following?.length} />
              <Typography style={{ fontSize: "17px" }}>Following  </Typography>

            </div>


          </div>
      
      </Card>
      <Space style={{ display: "flex", flexWrap: "wrap", margin: "auto", width: "100%", padding: "auto" ,marginTop :"10px"}}>
        {user?.posts?.length > 0 ? (
          <>
            {user?.posts?.map((post) => (
              <Posts
                key={post?._id}
                username={post?.owner.username}
                image={post?.imageUrl}
                postId={post?._id}
                name={post?.name}
                owner={post?.owner}
                comments={post?.comments}
                likes={post?.likes}
              />
            ))}
          </>
        ) : (
          <Typography>no Post posted</Typography>
        )}
      </Space>

      <AccountModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}

      />

    </div>
  )
}


export default User