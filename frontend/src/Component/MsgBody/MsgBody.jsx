import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Image, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';
import { fileType } from '../../Middleware';
import './MsgBody.css';
import { useNavigate } from 'react-router-dom';

const MsgBody = ({ msg }) => {
    const { user } = useSelector((state) => state.user);
    const navigate  = useNavigate()
    return (
        <div>
            <div className='sender'>
                {
                    msg?.sender?._id !== user?._id &&
                    <>
                        <Avatar
                            className="avatar"
                            icon={<UserOutlined />}
                            src={msg?.sender?.avatar?.url}
                            style={{ marginRight: '2px' }}
                        />
                        {
                            fileType(msg?.content) == "message" &&

                            <
                                Typography.Text
                                className={`${msg?.sender?._id !== user?._id ? "msgContent" : " "}`}
                            >
                                {msg?.sender?._id !== user?._id && (
                                    <a href="/profile">{msg?.sender?.name}</a>
                                )}
                                <div >
                                    {msg?.content}
                                </div>
                                <span className='timestamp'>

                                    {
                                        moment(new Date(msg?.createdAt)).format('h:mm A')
                                    }
                                </span>

                            </Typography.Text>
                        }

                        {
                            fileType(msg?.content) == "post" &&
                            <span className={`${msg?.sender?._id !== user?._id ? "msgContent" : " "}`}>
                                <Typography.Text>
                                    {msg?.sender?._id !== user?._id && (
                                        <a
                                                onClick={() => { navigate(`/user/${msg?.sender?._id}`) }}
                                         
                                         >{msg?.sender?.name}</a>
                                    )}
                                </Typography.Text>

                                <Card
                                    bodyStyle={{ padding: "0" }}


                                    className="msgCardPost">
                                    <div className='msgCardHeader'>
                                        <Avatar src={JSON.parse(msg?.content)?.owner?.avatar?.url} />
                                            <Typography.Text
                                                onClick={() => { navigate(`/user/${JSON.parse(msg?.content)?.owner?._id}`) }}
                                        
                                                strong> {JSON.parse(msg?.content)?.owner?.username}</Typography.Text>
                                    </div>
                                    <img className='msgCardPostImage' src={JSON.parse(msg?.content)?.image} />
                                    <span className='timestampPost'>

                                        {
                                            moment(new Date(msg?.createdAt)).format('h:mm A')
                                        }
                                    </span>
                                </Card>
                            </span>

                        }

                        {
                            fileType(msg?.content) == "image" &&
                            <span className={`${msg?.sender?._id !== user?._id ? "msgContent" : " "}`}>
                                <Typography.Text>
                                    {msg?.sender?._id !== user?._id && (
                                        <a href="/profile">{msg?.sender?.name}</a>
                                    )}
                                    </Typography.Text>
                                    <span
                                    >
                                        <div style = {{ position : "relative" ,height : "100%"}}>

                                   

                                        <Image style={{
                                       backgroundColor : "white", width: "180px", borderRadius: "12px",
                                        }} src={msg?.content} />
                                        <span className='timestampPostSender'>

                                            {
                                                moment(new Date(msg?.createdAt)).format('h:mm A')
                                            }
                                            </span>
                                        </div>
                                    </span>

                            </span>

                            

                        }
                        {
                            fileType(msg?.content) == "video" &&
                            <span className={`${msg?.sender?._id !== user?._id ? "msgContent" : " "}`}>
                                <Typography.Text>
                                    {msg?.sender?._id !== user?._id && (
                                        <a href="/profile">{msg?.sender?.name}</a>
                                    )}
                                    </Typography.Text>
                                    <span
                                    >

                                        <ReactPlayer
                                            width={290}
                                            style={{
                                                width: "180px", borderRadius: "12px",
                                            


                                            }}
                                            light
                                            url={msg.content}
                                            controls={true}

                                        />
                                        <span className='timestampPost'>

                                            {
                                                moment(new Date(msg?.createdAt)).format('h:mm A')
                                            }
                                        </span>
                                    </span>

                            </span>

                            

                        }







                    </>
                }
            </div>
            <div className='receiver'>
                {msg?.sender?._id === user?._id &&
                    < >
                        {
                            fileType(msg?.content) == "message" && <Typography.Text
                                className={`${msg?.sender?._id !== user?._id ? "msgContent" : "msgContentUser "}`}
                            >
                                <div>
                                    {msg?.content}
                                </div>
                                <span className='timestamp'>
                                    {
                                        moment(new Date(msg?.createdAt)).format('h:mm A')
                                    }   </span>

                            </Typography.Text>
                        }
                        {
                            fileType(msg?.content) == "post" &&
                            <span className={`${msg?.sender?._id !== user?._id ? "msgContent" : " "}`}>
                                <Typography.Text>
                                    {msg?.sender?._id !== user?._id && (
                                        <a href="/profile">{msg?.sender?.name}</a>
                                    )}
                                </Typography.Text>

                                <Card
                                    bodyStyle={{ padding: "0" }}
                                    className="msgCardPost">
                                    <div className='msgCardHeader'>
                                        <Avatar src={JSON.parse(msg?.content)?.owner?.avatar?.url} />
                                        <Typography.Text
                                        
                                            onClick={() => { navigate(`/user/${JSON.parse(msg?.content)?.owner?._id}`) }}
                                            
                                            strong> {JSON.parse(msg?.content)?.owner?.username}</Typography.Text>
                                    </div>
                                    <img className='msgCardPostImage' src={JSON.parse(msg?.content)?.image} />
                                    <span className='timestampPost'>

                                        {
                                            moment(new Date(msg?.createdAt)).format('h:mm A')
                                        }
                                    </span>
                                </Card>
                            </span>

                        }
                        {
                            fileType(msg?.content) == "image" && <span
                            >

                                <Image style={{
                                    width: "180px", borderRadius: "12px",
                                    border: "4px solid rgb(85, 83, 196)"


                                }} src={msg?.content} />
                                <span className='timestampPost'>

                                    {
                                        moment(new Date(msg?.createdAt)).format('h:mm A')
                                    }
                                </span>
                            </span>

                        }

                        {
                            fileType(msg?.content) == "video" && <span
                            >
                                <ReactPlayer
                                    width={290}
                                    style={{background : "white",
                                        width: "180px", borderRadius: "12px",
                                        border: "4px solid rgb(85, 83, 196)"


                                    }}
                                    light
                                    url={msg.content}
                                    controls={true}

                                />
                                <span className='timestampPost'>

                                    {
                                        moment(new Date(msg?.createdAt)).format('h:mm A')
                                    }
                                </span>
                            </span>
                        }
                    </>}

            </div>

        </div>
    )
}

export default MsgBody