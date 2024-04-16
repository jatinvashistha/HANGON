import { ArrowDownOutlined, CloseOutlined, MoreOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Dropdown, FloatButton, Input, Menu, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AddGroup from '../Component/Add Group/AddGroup';
import ChatHeader from '../Component/ChatHeader/ChatHeader';
import GroupChatSideBar from '../Component/GroupChatSideBar/GroupChatSideBar';
import MsgBody from '../Component/MsgBody/MsgBody';
import MsgInputFooter from '../Component/MsgInputFooter/MsgInputFooter';
import { imageUpload } from '../Middleware';
import '../PagesCss/UserChat.css';


import { allMessage, deleteChat, deleteMessage, fetchChat, fetchSingleChat, renameGroup, seenMessage, sendMessage } from '../Redux/Actions/Chat';
import { socket } from '../Socket';

const UserChat = ({ setSocketConnected, socketConnected }) => {

    const chatContainerRef = useRef(null);
    const navigate = useNavigate();
    const { chats } = useSelector((state) => state.fetchChat);
    const { messages } = useSelector((state) => state.allMessage);
    const { message } = useSelector((state) => state.sendMessage);
    const [seenBy, setSeenBy] = useState([])
    const { user } = useSelector((state) => state.user);
    const param = useParams();
    const dispatch = useDispatch();
    const [chatRoom, setChatRoom] = useState(false);
    const [chatName, setChatName] = useState({});
    const [input, setInput] = useState('');
    const [isSideNavbarVisible, setSideNavbarVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allMessages, setAllMessages] = useState([])
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [msgLoading, setMsgLoading] = useState(false);
    const { chat } = useSelector((state) => (state.singleChat))
    const [containerScroll, setContainerScroll] = useState(chatContainerRef?.current?.scrollHeight - chatContainerRef?.current?.scrollTop);

    const initializeSocket = () => {
        if (user?._id) {
            if (chatName?._id) {
                socket.emit('joinChat', chatName._id);
                socket.on('chatJoined', async () => {
                    setChatRoom(true);
                    console.log('socket connected')
                });
            }
        }
    };
    const singlechat = async () => {
        await dispatch(fetchSingleChat(param.id))

    }
    useEffect(() => {
        singlechat();
    }, [])
    const handle = async (e) => {
        try {
            setMsgLoading(true);
            const { data } = await imageUpload(e);
            const msg = {
                _id: generateRandomObjectId(),
                sender: user,
                content: data.url,
                createdAt: Date.now(),
                chat: chatName
            }
            setAllMessages([...allMessages, msg])
            socket.emit("newMessage", msg)
            await dispatch(sendMessage(param.id, data.url))
            // initializeSocket();
        } finally {
            setMsgLoading(false);
        }
    };
    function generateRandomObjectId() {
        const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
        const objectId = timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
            return (Math.random() * 16 | 0).toString(16);
        }).toLowerCase();

        return objectId;
    }
    const handleSeen = (userItem) => {

        if (param.id === userItem.chat) {
            setSeenBy(
                (prev) => {

                    if (prev?.find((item) => item?._id === userItem?._id)) {

                        return [...prev];
                    } else {
                        console.log('okay baby')
                        return [...prev, userItem.user];
                    }
                }
            )    
}

    }
    useEffect(() => {
        if (chatContainerRef?.current?.scrollHeight - chatContainerRef?.current?.scrollTop < 1200) {

            handleScrolling();
        }
            
            
            
      
    },[allMessages])

    useEffect(() => {

        setChatName(chat)
        chat?.latestMessage?.seenBy.map((msg) => {
            if (msg?.user?._id === user?._id) {

                setSeenBy([...seenBy, msg?.user])

            }
        })

    }, [chat])
    useEffect(() => {
        dispatch(fetchChat());
    }, [socket])

    const   handleScrolling = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight+78777;
        }
    }

    const fetchMessage = async () => {
        try {
            const msgs = await allMessage(param.id);
            const newMessages = msgs.map(item => ({
                sender: item.sender,
                content: item.content,
                createdAt: item.createdAt,
                chat: item.chat,
                id: item._id
            }));
            setAllMessages([...newMessages]);
            handleScrolling();
        } catch (e) {
            console.log(e.message);
        }
    }

    useEffect(() => {
        fetchMessage();
        handleScrolling();
    }, [])
    useEffect(() => {
        socket.on("typing", () => {
            setIsTyping(true)
        })
        socket.on("stop typing", () => {
            setIsTyping(false)
        })

    }, [socket])
    useEffect(() => {
        socket.on('seenMsg', (user) => {
            console.log('hhh')
            
            handleSeen(user)
        })

    }, [socket])


    const typingHandler = () => {
        setTyping(true);
        socket.emit('typing', param.id)
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength) {
                socket.emit("stop typing", param.id)
                setTyping(false);
            }
        }, timerLength)
    }

    const sendMsg = async (e) => {
        e.preventDefault();
        try {

            if (!isSideNavbarVisible && input) {
                setSeenBy([])
             
                socket.emit('stop typing', param.id)
                const msg = {
                    _id: generateRandomObjectId(),
                    sender: user,
                    content: input,
                    createdAt: Date.now(),
                    chat: chatName
                }
                setSeenBy([])
                setAllMessages([...allMessages, msg])
                socket.emit("newMessage", msg)
                setInput('')
                await dispatch(sendMessage(param.id, input))
                handleScrolling();


            }
        } catch (e) {
            console.log(e.message)
        }
    }
    useEffect(() => {

        initializeSocket();
    }, [chatName]);
    const seenMessageApi = async () => {
        console.log(chatName?._id,'ha')
        await dispatch(seenMessage(param.id))
    }



    useEffect(() => {
        seenMessageApi();
    }, [chatName]);
    



    useEffect(() => {
        return () => {
            socket.emit('leave', param.id);
            setChatRoom(false);
            seenMessageApi();
            console.log('socket disconnected')
        };
    }, [])


    useEffect(() => {
        socket?.on('messageReceived', (messageRecieved) => {
            setSeenBy([])
            if (param.id == messageRecieved?.chat?._id) {
                console.log(param.id)
                setAllMessages(
                    prevMessages => {
                        const x = prevMessages?.forEach((msg) => {
                         
                            if (msg?._id === messageRecieved?._id) {
                                
                                return msg
                            }

                        })
                        if (x) {
                            return [...prevMessages]
                        } else {
                            return [...prevMessages, messageRecieved]

                        }
                    }
                );

            //     socket.emit('seenMessage', {
            //         user,
            //    chat : param.id

            //     })
                dispatch(fetchChat())
            }
        });
    }, []);

    const showModal = (e) => {
        setIsModalVisible(true);
    };
    const handleOk = (e) => {
        setIsModalVisible(false);
        setNewGroupName('');
    };

    const handleCancel = (e) => {
        setIsModalVisible(false);
    };

    const handleRenameGroupClick = async (e) => {
        try {
            if (newGroupName) {
                setLoading(true);
                await dispatch(renameGroup(chatName?._id, newGroupName));
                await dispatch(fetchChat());
                setLoading(false);
                handleCancel();
            } else {
                message.warning("Enter Group name");
            }
        } catch (e) {
            console.log(e);
        }
    };

    const showAddMemberModal = (e) => {
        setIsAddMemberModalVisible(true);
    };

    const handleAddMemberOk = (e) => {
        setIsAddMemberModalVisible(false);
    };

    const handleAddMemberCancel = (e) => {
        setIsAddMemberModalVisible(false);
    };
    const toggleSideNavbar = (e) => {
        setSideNavbarVisible(!isSideNavbarVisible);
    };

    const handleDeleteChat = async (e) => {
        try {
            await dispatch(deleteChat(chatName?._id))
            navigate('/chats')
        } catch (e) {
            console.log(e)
        }
    }
    // useEffect(() => {
    //     chatName?.latestMessage?.seenBy?.forEach((item) => {
    //         handleSeen(item)
    //     })
    // }, [chatName])
    const handleDeleteMessage = async () => {
        dispatch(deleteMessage(chatName?._id))
        navigate('/chats')
        await dispatch(fetchChat())
    }


    useEffect(() => {
        const chatElement = chatContainerRef.current;

        const handleScroll = () => {
            setContainerScroll(chatContainerRef?.current?.scrollHeight - chatContainerRef?.current?.scrollTop)
           
        };

        if (chatElement) {
            chatElement.addEventListener('scroll', handleScroll);

            return () => {
                chatElement.removeEventListener('scroll', handleScroll);
            };
        }
    }, [chatContainerRef]);

    return (
        <div className='center chatLayout'>
            <Col
                className='userChat'
                sx={23.5} md={16} lg={10}
            >
                <div
                    className='userChatCard'
                >

                    <ChatHeader handleDeleteMessage={handleDeleteMessage} isTyping={isTyping} chatName={chatName} toggleSideNavbar={toggleSideNavbar} />
                    <div className='userChatCardHeader' >
                        <div
                            
                        
                            className='scrollbar userChatCardMessageAllMessage' ref={chatContainerRef}>
                            {allMessages?.map((msg, key) => {
                                return (
                                    <MsgBody msg={msg} />
                                )
                            }
                            )}

                            <div style={{ position: 'absolute', bottom: "0", width: '100%' }} >
                                <div className='center' style={{ display: "flex", justifyContent: "flex-end" }} >

                                    {chat?.latestMessage?.seenBy?.map((use, key) => {

                                        if (use?.user?._id !== user?._id && chatName?.latestMessage?.sender !== user?._id) {
                                        return <div key={key} style={{ margin: "0 2px" }}  >
                                            <Avatar src={use?.user?.avatar?.url} size={12} />
                                        </div>
                                        }
                                    })}

                                </div>

                            </div>
                        </div>
                        <div
                            className='sideDropMenu'

                            style={{

                                right: isSideNavbarVisible ? '3px' : '-05560px',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: "center", justifyContent: "space-between", padding: "  10px",backgroundColor :'#f6f6f6' }} >
                                <span onClick={toggleSideNavbar}><CloseOutlined />  </span>
                                {chatName && chatName?.groupAdmin?._id === user?._id ? (
                                    <Dropdown overlay={
                                        <Menu>
                                            <Menu.Item onClick={showModal}>Rename Group</Menu.Item>
                                            <Menu.Item onClick={showAddMemberModal}>Add Member</Menu.Item>
                                        </Menu>
                                    }>
                                        <MoreOutlined />
                                    </Dropdown>
                                ) : (
                                    <Button onClick={handleDeleteChat} >Exit Group</Button>
                                )}
                            </div>
                            <GroupChatSideBar  chat={chatName} />
                        </div>
                        <FloatButton onClick={handleScrolling}
                            className={`${(containerScroll) < 1200 ? 'floatButtonNone' : 'floatButton'}`}
                            icon={<ArrowDownOutlined />} />
                    </div>
                    <MsgInputFooter handle={handle} isSideNavbarVisible={isSideNavbarVisible} setInput={setInput} typingHandler={typingHandler} input={input} sendMsg={sendMsg} chatName={chatName} />
                    <Modal
                        footer={
                            <>
                                <Button onClick={handleCancel}>Cancel</Button>
                                <Button loading={loading} sendMsg={sendMsg} handle={handle} onClick={handleRenameGroupClick} type="primary">Rename</Button>
                            </>
                        }
                        title="Rename Group"
                        open={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                    >
                        <Input
                            value={newGroupName}
                            onChange={(e) => {
                                setNewGroupName(e.target.value)

                            }}
                            placeholder="Enter new group name"
                        />
                    </Modal>

                    <Modal
                        footer={null}
                        title="Add Member"
                        visible={isAddMemberModalVisible}
                        onOk={handleAddMemberOk}
                        onCancel={handleAddMemberCancel}
                    >
                        <AddGroup chatUsers={chatName?.users} chatName={chatName} setIsAddMemberModalVisible={setIsAddMemberModalVisible} />
                    </Modal>
                </div>
            </Col>
        </div>
    );
};

export default UserChat;
