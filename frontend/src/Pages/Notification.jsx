import { Avatar, Button, Col, Divider, List, Typography } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../PagesCss/Notifications.css';
import { CheckOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkBlockedUser, checkBlockingYou, followButton } from '../Middleware'
import { allNotifications, seenNotifications } from '../Redux/Actions/Notifications'
import { socket } from '../Socket'
import { formatDistanceToNow } from 'date-fns';

const Notification = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [allNotification, setAllNotifications] = useState([])
    const { user } = useSelector(state => state.user)
    const { notification, loading } = useSelector(state => state.getAllNotifications)

    const state = useSelector((state) => state);
    useEffect(() => {
        dispatch(allNotifications());
    }, [])
    useEffect(() => {


    }, []);
    const handleFollow = async (id) => {
        followButton(dispatch, id)
    }
    useEffect(() => {
        setAllNotifications(notification)

    }, [notification])
    useEffect(() => {
        setAllNotifications(notification)

    }, [socket])

    const navigateToProfile = (id) => {
        navigate(`/user/${id}`)

    }
    const navigateToPost = (id) => {
        navigate(`/anypost/${id}`)
    }
    useEffect(() => {
        return () => {
            // dispatch(seenNotifications());
            // dispatch(allNotifications());
            // setAllNotifications(notification)
        }
    }, [])
    const markAllRead = () => {
        dispatch(seenNotifications());
        dispatch(allNotifications());
    }


    return (
        <div className='notificationLayout'>
            <Col xs={24} md={16} sm={12} className='notificationInsider' >

                <div className='notificationHeading'>
                    <Typography.Title ><strong style={{ color: "white" }}>Notifications</strong> </Typography.Title>
                    <Button
                        onClick={() => markAllRead()}
                        className="loginButton"
                        style = {{ width : "120px"}}
                    
                    >Mark all read</Button>

                </div>
                <List className='glass notificationInside scrollbar' >
                    {
                        allNotification?.length > 0 ?
                            <>
                                {
                                    allNotification.map((item, key) => {
                                        return (
                                            <>
                                                {
                                                    !checkBlockedUser(user, item?.sender) && !checkBlockingYou(user, item?.sender) &&
                                                    <div >
                                                        <Col xs={24}
                                                            key={key}
                                                            className='notification'
                                                        // className={item?.isRead ? "notification" : "notRead"}
                                                        >
                                                            <div className='notificationSection'>
                                                                <div className='notificationTime' style={{ color: "gray", fontSize: "10px" }}>{formatDistanceToNow(item?.timestamp)} ago</div>
                                                                <div className='notifiactionText'>
                                                                    <div>
                                                                        <Avatar size={40} src={item?.sender?.avatar?.url}  ></Avatar>
                                                                        <span onClick={() => { navigateToProfile(item?.sender?._id) }} style={{ color: "#3b31b9", margin: "10px 10px" }}>@{item?.sender?.username} </span>
                                                                            {item.message}

                                                                            {!item?.isRead && <span
                                                                                className='dotNofication'
                                                                            
                                                                            >.</span>}
                                                                        {/* <>
                                                                {item?.item?.comment && <strong style={{ color: "black" }}>  {item?.item?.comment} </strong>
                                                                }
                                                                {item?.item?.item?.comment && <strong style={{ color: "black" }}>  {item?.item?.item?.comment} </strong>
                                                                }
                                                            </> */}
                                                                    </div>
                                                                    <div >

                                                                        {item.message !== "Started following you" ?
                                                                            <>
                                                                                {
                                                                                    item?.item?.post?.imageUrl?.url ?
                                                                                        <Avatar
                                                                                            size={50}
                                                                                            src={item?.item?.post?.imageUrl?.url}

                                                                                            alt="User Avatar"
                                                                                            style={{ borderRadius: "2px" }}
                                                                                            onClick={() => { navigateToPost(item?.item?.post?._id) }}
                                                                                        /> :
                                                                                        <Avatar
                                                                                            size={50}
                                                                                            src={item?.item?.item?.imageUrl?.url}

                                                                                            alt="User Avatar"
                                                                                            style={{ borderRadius: "2px" }}
                                                                                            onClick={() => { navigateToPost(item?.item?.item?._id) }}
                                                                                        />
                                                                                }               </>
                                                                            : <div>
                                                                                <>
                                                                                    {
                                                                                        !user?.following?.some((element) => {

                                                                                            return element?.user?._id === item?.sender?._id
                                                                                        }) ?
                                                                                            <Button type="primary" className='loginButton '

                                                                                                onClick={() => { handleFollow(item?.sender._id) }} style={{ padding: '5px  10px', width: "100px" }} icon={<UserAddOutlined />}>Follow</Button>
                                                                                            : <Button onClick={() => { handleFollow(item?.sender?._id) }} style={{ borderRadius: "2px", padding: '5px 10px' }} icon={<CheckOutlined />}>Following</Button>
                                                                                    }</>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>



                                                        </Col>
                                                        <div className='dividerNotification'>
                                                            .
                                                        </div>
                                                    </div>
                                                }
                                            </>
                                        )
                                    }).reverse()
                                }

                            </> : <>No notification yet.</>
                    }


                </List>
            </Col>

        </div>
    )
}

export default Notification