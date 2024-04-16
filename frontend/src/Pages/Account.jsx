import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Divider, Dropdown, Menu, Row, Typography, Avatar, Tabs } from 'antd';
import { EditOutlined, MessageOutlined, MoreOutlined, SettingOutlined, UserAddOutlined, CheckOutlined } from '@ant-design/icons';
import UserList from '../Component/UserList/UserList';
import Posts from '../Component/Posts/Posts';
import AccountModal from '../Component/AccountModal/AccountModal';
import { anyUser } from '../Redux/Actions/User';
import { addOrSeeChat } from '../Redux/Actions/Chat';
import { blockButton, checkBlockedUser, checkBlockingYou, followButton } from '../Middleware';
import '../PagesCss/Account.css'
import Spot from '../Component/Spot/Spot';


const { TabPane } = Tabs;

const Account = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [mainUser, setMainUser] = useState({});
  const user = useSelector(state => state.user);
  const anyUserState = useSelector(state => state.anyUser);
  const { chat } = useSelector(state => state.addOrSee);
  const [followings , setFollowings] = useState([])

  useEffect(() => {
    if (params.id !== user.user._id) {
      fetchData();
       setMainUser(anyUserState.user);
    } else {
      setMainUser(user?.user);
     
    }
  }, [params.id, user]);
  useEffect(() => {
    const setData = () => {
      if (params.id !== user.user._id) {
       
        setMainUser(anyUserState.user);
        setFollowings(anyUserState?.user?.following)
      } else {
        setMainUser(user?.user);
        setFollowings(user?.user?.following)
      }
      
    }
    setData();

   
  }, [anyUserState]);


  useEffect(() =>{
    setFollowings(user?.user?.following)
  }, [mainUser])
  
  

  const fetchData = async () => {
    try {
      await dispatch(anyUser(params?.id));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const addChat = async () => {
    try {
     const chat =  await addOrSeeChat(mainUser?._id);
     navigate(`/chat/${chat._id}`)
    } catch (error) {
      console.error('Error adding or seeing chat:', error);
    }
  };

  const handleFollow = async id => {
    try {
      await followButton(dispatch, id);
      await dispatch(anyUser(params?.id));
    } catch (error) {
      console.error('Error handling follow:', error);
    }
  };

  const handleBlock = async () => {
    try {
      
      await blockButton(dispatch, mainUser?._id);
      await dispatch(anyUser(params?.id));
    } catch (error) {
      console.error('Error handling block:', error);
    }
  };

  const editProfile = () => {
    navigate('/editprofile');
  };

  return (
    <div className='row scrollbar'>
      {mainUser?._id && user.user._id && (
        <Row  className='rowBottom'>
          <Col  xs={24} sm = {24}  md={12}  lg = {10} >
            <Spot />

            <div>
              {!checkBlockedUser(user.user, mainUser) && !checkBlockingYou(user.user, mainUser) && mainUser?._id !== user.user._id && (
                <Dropdown
                  className='dropdownBlock'
                  overlay={
                    <Menu>
                      <Menu.Item onClick={handleBlock}>Block</Menu.Item>
                    </Menu>
                  }
                >
                
                  <MoreOutlined />
                </Dropdown>
              )}
            </div>
            <div className='accountLayout'>

         
            <div className='accountProfile'>
             
                  <div className='center'>

                  <Avatar  className='avatarUser' size={160} src={mainUser?.avatar?.url} />
                  </div>
                <div className='nameUsernameBox' style={{ marginTop: "20px" }}>
                  <Typography.Title className = "nameUsername" style={{ fontSize: "30px",color : "white"}}>{mainUser?.name?.toUpperCase()}</Typography.Title>
                    <Typography className="nameUsername username" style={{ fontSize: "16px",marginTop: "-10px" }}><b>@{mainUser?.username}</b></Typography>
                    <Typography.Paragraph className="nameUsername" style={{ marginTop: "13px", color: "gray", fontWeight: "bold" ,}}>{mainUser?.bio}</Typography.Paragraph>
                </div>
              </div>
              <div className='buttons'>
                {!checkBlockingYou(user.user, mainUser) && (!checkBlockedUser(user.user, mainUser) ? (
                  <>
                    {user.user._id === params.id ? (
                      <div className='center mainButtons '>
                          <Button onClick={editProfile} icon={<EditOutlined />} className='loginButton accountButton' type="primary" style={{ marginRight: "10px", width : '150px' }}>Edit Profile</Button>
                          <Button className='loginButton accountButton' style={{  width: '150px' }} onClick={() => setModalVisible(true)} icon={<SettingOutlined />} type="default">Account</Button>
                      </div>
                    ) : (
                        <div className='center mainButtons' >
                          <Button onClick={addChat} icon={<MessageOutlined />} className='loginButton accountButton' type="primary" style={{ marginRight: "10px", width: '150px',backgroundColor : "white" }}>Message</Button>
                          <Button onClick={() => handleFollow(mainUser?._id)} className='loginButton accountButton' style={{ width: '150px' }} type="default">
                          {user.user.following.some(use => use?.user?._id === params.id) ? <><CheckOutlined /> Following</> : <> <UserAddOutlined /> Follow</>}
                        </Button>
                      </div>
                    )}
                 
                      <div className='center followerSection'>
                        <div className=' userData' >
                       
                          <UserList sizee={true} value={mainUser?.posts?.length}/>
                          <Typography className='followerText' >Posts</Typography>
                      </div>
                      <Divider type="vertical" style={{ height: '60px' }} />
                      <div className='center userData'>
                        <UserList followerList = {true} sizee={true} users={mainUser?.followers}  value={mainUser?.followers?.length} />
                          <Typography className='followerText' >Followers</Typography>
                      </div>
                      <Divider type="vertical" style={{ height: '60px' }} />
                      <div className='center userData'>
                        <UserList sizee={true} users={followings} value={mainUser?.following?.length} />
                          <Typography className='followerText'>Following</Typography>
                      </div>
                    </div>
                  </>
                ) : (
                  <Button type='primary' onClick={handleBlock}>Unblock</Button>
                ))}
             
              </div>
            </div>
          </Col>
          {!checkBlockedUser(user.user, mainUser) && !checkBlockingYou(user.user, mainUser) && (
            <Col  sm ={24} md={12} xs={24} lg={14}>
              <div className='tablist'>
                <Tabs className='tabs' defaultActiveKey="1">
                  <TabPane tab="User Post" key="1">
                    <div className='UserPost center'>
                      {mainUser?.posts?.length > 0 ? (
                        <>
                          {mainUser?.posts?.map(post => (

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
                        <Typography>  </Typography>
                      )}
                    </div>
                  </TabPane>
                  <TabPane tab="Interested Post" key="2">
                    <div className='UserPost'>
                      {mainUser?.interestedPost?.length > 0 ? (
                        <>
                          {mainUser?.interestedPost?.map(post => (

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
                        <Typography></Typography>
                      )}
                    </div>
                  </TabPane>
                  {user.user._id === mainUser._id && (
                    <TabPane tab="Saved Post" key="3">
                      <div className='UserPost'>
                        {mainUser?.savedPost?.length > 0 ? (
                          <>
                            {mainUser?.savedPost?.map(post => (
                              

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
                          <Typography></Typography>
                        )}
                      </div>
                    </TabPane>
                  )}
                </Tabs>
              </div>
            </Col>
          )}
        </Row>
      )}
      <AccountModal visible={modalVisible} onCancel={() => setModalVisible(false)} />
    </div>
  );
};

export default Account;
