import { CheckOutlined, MoreOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, List, Modal, Space } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { anyUser, followAndUnfollow, loadUser } from '../../Redux/Actions/User';
import { useDispatch, useSelector } from 'react-redux';
import { followButton, removeFollowerFromList } from '../../Middleware';
import CustomSearch from '../CutomSearch/CustomSearch';
import { removeFollower } from '../../Redux/Actions/Post';
import './UserList.css'

const UserList = ({
    users = [], value, sizee = false ,followerList = false
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [dataList, setDataList] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const  {user} = useSelector((state) => (state.user))


    const showModal = () => {
        if (users?.length > 0) {
            
            setIsModalOpen(true);
        }
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleFollow = async (id) => {
        followButton(dispatch, id)
    }


    const handleNavigate = (use) => {
        navigate(`/user/${use?.user?._id}`)
        dispatch(anyUser(use?.user?._id))
        setIsModalOpen(false);

    }
    useEffect(() => {
        setDataList([...users])
    }, [])
    const handleRemoveFollower = (userId) => {
        removeFollowerFromList(dispatch,userId)
    }


    return (
        <div>
            <span className='followerText' style={!sizee ? { paddingLeft: '5px',color :"black"} : { fontSize: "22px",color : 'gray' }} onClick={showModal}>{value}</span>

            {users?.length > 0 && <Modal
                        
                footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                <List
                    
                
                    
                    style={{ margin: '10px 5px' }}
                    >
                    <CustomSearch users={users} setDataList={setDataList} />
                    {
                        dataList?.map((use) => {
                            // console.log(use?.user?._id , user?._id)
                            return (
                                <List.Item style={{ display: 'flex', alignItems: "center", justifyContent: "space-between" }}>
                                   <div style={{ cursor: "pointer" }} onClick={() => { handleNavigate(use) }}>
                                        <div >
                                            <Avatar onClick={() => { }} src={use?.user?.avatar?.url} />
                                            {use?.user?.name}
                                        </div>
                                    </div>
                                    <>
                                        {followerList?
                                            <>
                                                {
                                                    user?.followers?.find((item) => item?.user?._id === use?.user?._id) && <Button
                                                        style={{ width: "130px" }}
                                                        onClick={() => handleRemoveFollower(use?.user?._id)}
                                                        className='loginButton'
                                                    >
                                                        Remove
                                                    </Button>
                                              }
                                        
                                           
                                            </>
                                        : <>
                                     



                                                {
                                                    (use?.user?._id !== user?._id) && 
                                            <>{
                                                        !user?.following?.some((element) => element?.user?._id === use?.user?._id)
                                            
                                                            ?

                                                <Button type="primary"
                                                    className='loginButton'
                                                
                                                    onClick={() => { handleFollow(use?.user?._id) }} style={{ padding: '5px 10px', width: "100px" }} icon={<UserAddOutlined />}> Follow</Button>
                                                : <Button
                                                    className='loginButton'
                                                    onClick={() => { handleFollow(use?.user?._id) }} style={{ padding: '5px 10px',width : "100px",backgroundColor : "white" }} icon={<CheckOutlined />}>Following</Button>}
                                            </>}
                                        
                                        </>
}


                                    </>

                                </List.Item>
                            )
                        })
                    }
                </List>
            </Modal>}
        </div>
    )
}

export default UserList