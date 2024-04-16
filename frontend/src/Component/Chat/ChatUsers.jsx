import { GroupOutlined } from '@ant-design/icons'
import { Button, Card, Col, Divider, Input, List, Modal, Row, Space, Typography } from 'antd'
import Avatar, { Group } from 'antd/es/avatar'
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from 'react'
import { MdPeople, MdPeopleAlt } from 'react-icons/md'
import { formatDistanceToNow } from 'date-fns';
import './ChatUsers.css'
import { deleteChat, fetchChat } from '../../Redux/Actions/Chat';
import { useNavigate } from 'react-router-dom';
import GroupFormation from '../GroupFormation/GroupFormation';
import Search from 'antd/es/input/Search';
import { fileType } from '../../Middleware';
import Spot from '../Spot/Spot';
import { socket } from '../../Socket';
import { TbUsersGroup } from "react-icons/tb";
const ChatUsers = () => {
  const navigate = useNavigate();
  const { chats } = useSelector((state) => (state.fetchChat))
  const { user } = useSelector((state) => (state.user))
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputField, setInputField] = useState('')
  const [dataList, setDataList] = useState([])
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const dispatch = useDispatch();
  const fetchChats = async () => {

    try {
      await dispatch(fetchChat())

    } catch (e) {

    }
  }

  const searchItem = (valuee) => {

    if (valuee === "") {
      setDataList([...chats])
    }
    else {
      const filteredData = chats.filter(item => {
        if (item?.isGroupChat) {
          return item?.chatName?.toLowerCase()?.includes(valuee.toLowerCase())


        }
       else {
          const x = item?.users?.filter((item) => { return item?._id != user?._id })[0]
          
          return x?.name?.toLowerCase()?.includes(valuee.toLowerCase());
        }
      
      }
      );
      setDataList([...filteredData]);
    }
  }

  useEffect(() => {

    fetchChats();

  }, [])
  useEffect(() => {
    if (chats) {
    
      setDataList([...chats]);
  }


    
  },[chats])

  const handleChat = (id) => {
    navigate(`/chat/${id}`)
  }
  return (
    <div className='chatUserLayout center' >
      <Col sx={23.5} md={18} lg={14}
      >
        <div className='chatUserUpperSection ' direction='vertical' >
          <Card
            className='chatUserUpperCard glass'
            bodyStyle={{ padding: '0' }}
          >
            <Typography.Title style={{ margin: "20px 20px -19px 20px" }}>Messages</Typography.Title>
            <Card.Meta
              className='chatUsersCardMeta'
              description={
                <div className='center messageDescription'>
                  <Input
                    onChange={ (e) => {
                      searchItem(e.target.value)
                    }}
                    placeholder='Search Chats'
                    className="loginInput placeHolderColor" type='text' style={{ width: "70%" }} />
                  <div className='center' style={{ width: "30%" }} >
                    <Button
                      onClick={showModal}

                      className='button loginButton createGroup center' >


                      <b className='center' >
                        Create Group
                      </b></Button>

                  </div>
                </div>
              }
            />
          </Card>
          <List className='list scrollbar glass' >
            <Spot />
            {
              dataList?.map((chat) => {
                return (
                  <>
                    {
                      (chat?.isGroupChat || chat?.latestMessage) &&
                      <List.Item onClick={() => { handleChat(chat?._id) }} className="listItem" >
                        <Space>
                          {
                            chat?.isGroupChat ? <Avatar
                              size={43}
                              className='avatar'
                              src="https://www.unitedxp.co.il/wp-content/plugins/profilegrid-user-profiles-groups-and-communities/public/partials/images/default-group.png" />
                              :

                              <Avatar
                                className='avatar'
                                size={43}
                                src={chat?.isGroupChat ? <><MdPeopleAlt /> </> : chat?.users?.filter(item => item?._id !== user?._id)[0]?.avatar?.url}
                              />
                          }
                          <Space direction='vertical' >
                            {
                              chat?.isGroupChat ?
                                <Typography.Text strong className="userName"  > {chat?.chatName}  </Typography.Text> :
                                <Typography.Text className="userName" strong>
                                  {chat?.users?.filter((item) => { return item?._id != user?._id })[0]?.name
                                  }
                                </Typography.Text>
                            }

                            <Typography.Paragraph
                              className="userLastMessage"
                            >
                              {
                               ! chat?.latestMessage?.seenBy?.some(seenUser => seenUser?.user?._id === user._id) ? <>
                                  <b>
                                    <span >
                                      {
                                        fileType(chat?.latestMessage?.content) == "image" &&
                                        < span style={{ color: "white" }}>
                                          <b>      Sent a photo </b>
                                        </span>
                                      }
                                      {
                                        fileType(chat?.latestMessage?.content) == "video" &&

                                        <span style={{ color: "white" }}>
                                          <b> Sent a video </b>
                                        </span>
                                      }

                                      {
                                        fileType(chat?.latestMessage?.content) == "message" && <Typography.Text
                                          style={{ color: "white" }}

                                        >
                                          <b>

                                            {chat?.latestMessage?.content}</b> </Typography.Text>
                                      }
                                      {
                                        fileType(chat?.latestMessage?.content) == "post" && <div
                                          style={{ color: "white" }}

                                        >

                                          <b>
                                            Shared a post

                                          </b>
                                        </div>
                                      }
                                    </span>


                                  </b>
                                </> : <>

                                  <span>
                                    {
                                      fileType(chat?.latestMessage?.content) == "image" &&
                                      <span
                                        style={{ color: "gray" }}
                                      >
                                        Sent a photo
                                      </span>
                                    }
                                    {
                                      fileType(chat?.latestMessage?.content) == "video" &&
                                      <span
                                        style={{ color: "gray" }}


                                      >
                                        Sent a video
                                      </span>
                                    }

                                    {
                                      fileType(chat?.latestMessage?.content) == "message" && <Typography.Text
                                        style={{ color: "gray" }}


                                        className='msgContentLatestMsg'>

                                        {
                                          chat?.latestMessage?.content?.length > 8 ? <span> {chat?.latestMessage?.content?.substring(0, 8)}....</span> : <span> {chat?.latestMessage?.content}</span>
                                        }


                                      </Typography.Text>
                                    }
                                    {
                                      fileType(chat?.latestMessage?.content) == "post" && <div
                                        style={{ color: "gray" }}


                                      >
                                        Sent a post

                                      </div>
                                    }
                                  </span>

                                </>
                              }
                            </Typography.Paragraph>
                          </Space>
                        </Space>
                        <Space direction='vertical'>
                          <Typography.Text  >
                            {chat?.latestMessage?.createdAt &&

                              formatDistanceToNow(new Date(chat?.latestMessage?.createdAt), { addSuffix: true })
                            }
                          </Typography.Text>
                        </Space>

                      </List.Item>

                    }
                  </>
                )
              }
              )
            }
          </List>

          <Modal title="" footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <GroupFormation setIsModalOpen={setIsModalOpen} />
          </Modal>
        </div>
      </Col>
    </div>
  )

}

export default ChatUsers