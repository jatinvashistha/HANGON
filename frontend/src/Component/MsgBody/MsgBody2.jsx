import { UserOutlined } from '@ant-design/icons'
import { Avatar, Card, Image, Space, Tooltip, Typography } from 'antd'
import React, { useEffect } from 'react'
import { fileType } from '../../Middleware'
import { useSelector } from 'react-redux'
import { formatDistanceToNow } from 'date-fns'
import moment from 'moment';
import './MsgBody.css'
import ReactPlayer from 'react-player';

const MsgBody = ({ msg }) => {
    const { user } = useSelector((state) => state.user);

    return (
        <div className="MsgLayout" >
            <div key={msg?._id}
                className={`${msg?.sender?._id !== user?._id ? "msgContainer " : "msgContainerUser "}`}     >
  
                    {msg?.sender?._id !== user?._id && (
                        <Avatar
                            className="avatar"
                            icon={<UserOutlined />}
                            src={msg?.sender?.avatar?.url}
                            style={{ marginRight: '2px' }}
                        />
                    )}
                  
                    <div
                        className={`${msg?.sender?._id !== user?._id ? "senderMsg" : "userMsg"}`}

                    //   style={{ display: 'flex', justifyContent: msg?.sender?._id !== user?._id ? 'flex-start' : 'flex-end' }}
                    >
                        <div
                            className={`${msg?.sender?._id !== user?._id ? "senderMessage" : "userMessage"}`}
                        >
                            <div>
                                {msg?.sender?._id !== user?._id && (
                                    <a href="/profile">{msg?.sender?.name}</a>
                                )}
                            </div>
                        <span class = "msgContainerInside">

                            {
                                fileType(msg?.content) == "message" && <Typography.Text
                                    className={`${msg?.sender?._id !== user?._id ? "msgContent" : "msgContentUser"}`}
                                > {msg?.content} </Typography.Text>
                            }
                                {
                                fileType(msg?.content) == "image" &&
                              

                                
                                        <Image style={{ width :"150px", height : "150px"  ,borderRadius : "12px"}} src={msg?.content} />
                             
                                }
                                {
                                fileType(msg?.content) == "video" &&
                                <Card className='msgCardPost'>

                                        <ReactPlayer
                                            className = "reactVideoPlayer"
                                            light
                                            url={msg.content}
                                            controls={true}
                                         
                                        />
                                 
                                </Card>

                                }

                               
                                {
                                fileType(msg?.content) == "post" && <Card
                                    bodyStyle={{ padding : "0"}}
                                    
                                    className="msgCardPost"> 
                                        <div  className='msgCardHeader'>
                                            <Avatar src={JSON.parse(msg?.content)?.owner?.avatar?.url} />
                                            <Typography.Text strong> {JSON.parse(msg?.content)?.owner?.username}</Typography.Text>
                                        </div>
                                    <img className='msgCardPostImage'  src={JSON.parse(msg?.content)?.image} />
                                    </Card>
                            }
                            <div

                                className="timestamp">
                                {
                                    moment(new Date(msg?.createdAt)).format('h:mm A')

                                }
                            </div>
                            </span>
                     
                        </div>
                    </div>
             
            </div>
        </div>
    )
}

export default MsgBody