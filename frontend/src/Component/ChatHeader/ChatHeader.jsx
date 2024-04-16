import { ArrowLeftOutlined, DeleteFilled, MoreOutlined, RadarChartOutlined } from '@ant-design/icons'
import { Avatar, Button, Dropdown, Menu, Typography } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchChat } from '../../Redux/Actions/Chat'
import './ChatHeader.css'

const ChatHeader = ({
    chatName ,
    isTyping,
    toggleSideNavbar,
    handleDeleteMessage
}) => {
    const dispatch = useDispatch();
    const navigate  = useNavigate();
    const { user } = useSelector((state) => state.user);
    const navigateBack = async () =>{
        navigate('/chats')
        await dispatch(fetchChat())
    }
  return (
    <>
<div className='chatHeader center'>
                        <Typography  style={{   display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} >
                        <ArrowLeftOutlined  onClick={() => {navigateBack()} }  style = {{ marginRight : "10px"}} />
                            <div>
                                {
                                    chatName?.isGroupChat ? <Avatar src="https://www.unitedxp.co.il/wp-content/plugins/profilegrid-user-profiles-groups-and-communities/public/partials/images/default-group.png" />
                                        :
                              <Avatar
                                  size={43}
                                            src={chatName?.users?.filter(item => item?._id !== user?._id)[0]?.avatar?.url}
                                        />
                                }
                            </div>
                            {chatName?.isGroupChat ? (
                                <>
                                    {chatName?.chatName}
                                </>
                            ) : (
                                <div  style = {{ marginLeft : "5px"}}>
                                  
                                    {chatName?.users?.filter((ele) => ele?._id !== user?._id)[0]?.name}
                                     {
                                    isTyping && <div style = {{ fontSize : "10px"}}>Typing...</div>
                                   }

                                </div>
                            )}
              </Typography>

              <Dropdown overlay={
                  <Menu>
                    

                      {chatName?.isGroupChat ?
                          <Menu.Item onClick={toggleSideNavbar}>Group</Menu.Item> : 
                      <Menu.Item onClick={handleDeleteMessage}>Delete Chat</Menu.Item>
                      }
                  </Menu>
              }>
                  <MoreOutlined style={{ color :'black'}} />
              </Dropdown>

              
                        {/* {
                            <RadarChartOutlined  / > : 
                        <Button  type="link" icon={<DeleteFilled />} />
              } */}
              
                    </div>


    </>
  )
}

export default ChatHeader