import { Avatar, Button, Card, Col, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { blockButton } from '../Middleware';
import { anyUser, followAndUnfollow, loadUser } from '../Redux/Actions/User';

const BlockedUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState({});
    const [all, setUser] = useState([]);
    const { user } = useSelector((state) => (state.user))
    useEffect(() => {

        setUser(user?.blockedUser);
    }, [user?.blockedUser]);


    const handleFollow = async (id) => {
        try {
            setLoading(prevLoading => ({ ...prevLoading, [id]: true }));
            await dispatch(followAndUnfollow(id));
            await dispatch(loadUser());
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(prevLoading => ({ ...prevLoading, [id]: false }));
        }
    }
    const handleNavigate = (id) => {
        navigate(`/user/${id}`)

    }
    const handleCut = (elementToRemove) => {
        const updatedUserList = all.filter((user) => user._id !== elementToRemove._id);
        setUser([...updatedUserList]);
    }

    const handleBlock = async (id) => {
        try {

            await blockButton(dispatch, id);
            await dispatch(anyUser(id));
        } catch (error) {
            console.error('Error handling block:', error);
        }
    };




    return (
        <div style={{ width: "100%", marginTop: "10px" }}>
       
            <div>
                
       
                <div className='scrollbar' style={{ display: "flex", flexWrap: "wrap", margin: "auto", justifyContent: "center", alignItems: "center", height: "86vh", overflowY: "scroll" }}>
                        {
                            all?.length > 0 &&
                            all?.map((item, key) => (
                                <>
                                   
                                    <Col key={key}
                                        style={{ margin: "5px", padding: "0" }}
                                        
                                        xs={12} sm={15} md={10} lg={7} xl={5}>
                                            <Card
                                                theme="dark"
                                                className='cardGlassNetwork center glass'

                                                hoverable={true}

                                            >
                                               
                                                <Card.Meta
                                                    theme="dark"
                                                    style={{
                                                        width: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}

                                                    avatar={<Avatar style={{ border: "3px solid black" }} size={90} src={item?.user?.avatar?.url} />} />
                                                <Card.Meta style={{ textAlign: 'center', marginTop: "12px" }} title={<Typography.Title className="nameUsername" style={{ fontSize: "15px", color: "white", textAlign: 'center' }}>{item?.user?.name?.toUpperCase()}</Typography.Title>} />
                                                <Card.Meta onClick={() => { handleNavigate(item._id) }} style={{ textAlign: 'center' }} title={<Typography className="nameUsername username" style={{ fontSize: "12px", textAlign: 'center', position: "relative" }}><b>@{item?.user?.username}</b></Typography>} />
                                            <div className='center' style={{ marginTop: "30px" }}>
                                                <Button
                                                    onClick={() =>{handleBlock(item?.user?._id)}}
                                                    
                                                    style={{ width: "100px", fontWeight: "bold", fontSize: "20px" }} className='loginButton center'>
                                                    <b
                                                        style={{  fontSize: "20px" }} 
                                                    >
                                                        Unblock
                                                </b>
                                                      
                                                 
                                                </Button>

                                                </ div>
                                            </Card>
                                        </Col>
                                
                                </>
                            ))
                        }

                    </div>
            </div>
           
        </div>
    );
};

export default BlockedUser;

    
    