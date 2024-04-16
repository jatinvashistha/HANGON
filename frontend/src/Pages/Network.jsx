import { CaretDownFilled, CheckOutlined, CloseCircleFilled, CloseCircleOutlined, CloseOutlined, PlusCircleFilled, PlusOutlined, SelectOutlined, UserAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Typography, Spin, Col, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followAndUnfollow, getAllUsers, loadUser } from '../Redux/Actions/User';
import { useNavigate } from 'react-router-dom';
import { allUserRequest } from '../Redux/Reducers/allUsers';
import FollowAndUnfollow from '../Component/FollowAndUnfollow/FollowAndUnfollow';

const Network = () => {
    const dispatch = useDispatch();
    const navigate  = useNavigate();
    const [loading, setLoading] = useState({});
    const [all, setUser] = useState([]);
    const { user } = useSelector((state) => (state.user))
    const { allUsers } = useSelector((state) => state.allUser);

    useEffect(() => {
        dispatch(getAllUsers());
    }, []);

    useEffect(() => {
      
        setUser(allUsers);
    }, [user?.following]);
    useEffect(() => {
        setUser(allUsers);
    }, [allUsers]);

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
    const handleNavigate = (id) =>{
       navigate(`/user/${id}`)

    }
    const handleCut = (elementToRemove) => {
        const updatedUserList = all.filter((user) => user._id !== elementToRemove._id);
        setUser([...updatedUserList]);
    }
    
    return (
        <div  style={{  width :"100%", marginTop : "10px" }}>        
     
            <div >
            <div className='scrollbar'  style={{ display: "flex", flexWrap: "wrap", margin: "auto" , justifyContent : "center",alignItems :"center" ,height : "86vh", overflowY :"scroll"}}>
                {
                    all?.length > 0 &&
                    all?.map((item,key) => (
                        <>
                            {
                                !user?.following?.some((ele) => (ele._id === item._id)) &&
                                <Col  key = {key} style = {{margin: "5px",padding : "0"}} xs={11} sm={15} md={10} lg={7} xl={5}>
                                <Card
                                theme="dark"
                                className='cardGlassNetwork center glass'
                               
                                    hoverable={true}
                                
                                    >
                              <Button onClick={() =>{handleCut(item)}}  style = {{position : 'absolute',top : "5px", right  : '5px' ,color : "black"  }}  icon = {  <CloseOutlined/>} type = "link"> 
                                 </Button>  
                                    <Card.Meta
                                      
                                      
                                      theme="dark"
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}

                                        avatar={<Avatar style = {{ border : "3px solid black"}}  size={90} src={item?.avatar?.url} />} />
                                            <Card.Meta style={{ textAlign: 'center', marginTop: "12px" }} title={<Typography.Title className="nameUsername" style={{ fontSize: "15px", color: "white",textAlign: 'center' }}>{item?.name?.toUpperCase()}</Typography.Title>} />
                                            <Card.Meta onClick={() => { handleNavigate(item._id) }} style={{ textAlign: 'center' }} title={<Typography className="nameUsername username" style={{ fontSize: "12px", textAlign: 'center',position:"relative"}}><b>@{item?.username}</b></Typography>} />
                                    <div style = {{ marginTop : "30px"}}>
                                                <FollowAndUnfollow item = {item} loading={loading} handleFollow={handleFollow} />

                                        </ div> 
                                </Card>
                                </Col>
                            }
                        </>
                    ))
                }

            </div>
    </div>
      
        </div>
    );
};

export default Network;
