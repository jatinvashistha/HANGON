
import React, { useEffect, useState } from 'react';
import { Badge, Button, Col, FloatButton, Layout, Menu } from 'antd';
import './Sidenavbar.css'
import { CiMenuFries } from "react-icons/ci";
import {

  TeamOutlined,
  UserOutlined,
  BellOutlined,
  HomeOutlined,
  UploadOutlined,
  MessageFilled,
  MenuOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../Socket';
import { allNotifications } from '../../Redux/Actions/Notifications';

const { Sider } = Layout;

const Sidenavbar = () => {
  const dispatch = useDispatch();
  const [msgCount, setMsgCount] = useState(0)
  const navigate = useNavigate();
  const { chats } = useSelector((state) => state.fetchChat);
  
  const [open, setOpen] = useState(true);
  const [close, setClose] = useState(false);

  const path = window.location.pathname
  const { user } = useSelector((state) => (state.user))
  const [collapsed, setCollapsed] = useState(false);
  const { notification } = useSelector(state => state.getAllNotifications)





  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleNavigate = (key) => {
    navigate(key.key);

  }

  useEffect(() => {
    const msgs = chats?.filter((chat) => {
      return !chat?.latestMessage?.seenBy?.some(seenUser => seenUser?.user?._id === user._id);

    });
    setMsgCount(msgs?.length)
  
  }, [socket, chats])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
    
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      trigger={null}
        breakpoint="xl"        
      width = {200}
  
        className={` ${open ? 'Sidenavbar' : "sideNavBarBottom"}`}
        
    >

        <Menu
        
          className={` ${open ? 'SidenavbarMenu' : "SidenavbarBottomMenu"}`} 
          mode="vertical" theme="dark" defaultSelectedKeys={[`${path}`]}>
          <Menu.Item onClick={handleNavigate} key="/" >
            <HomeOutlined style = {{ marginRight : '6px',fontSize : "22px"}} className={`${!open ? "menuIcon" : ""}`} />      {!collapsed && 'Home'}
        </Menu.Item>
        <Menu.Item onClick={handleNavigate} key="/chats"
        
          >
            <Badge style={collapsed ? { marginTop: "15px" } : {}} count={msgCount}  >
              <MessageFilled
                // style  = {{ color : "white"}}
                style={{ marginRight: '6px', fontSize: "20px" ,color : 'white'}}
                className={`${!open ? "menuIcon" : ""}`} />
            </Badge>
            {!collapsed && <span style = {{marginRight  :"3px"}}> Messages</span>}
        </Menu.Item>
        {/* <Menu.Item onClick={handleNavigate} key="/post" icon={<UploadOutlined />}>
          {!collapsed && 'Files'}
        </Menu.Item> */}
          <Menu.Item onClick={handleNavigate} key="/network" >
            <TeamOutlined style={{ marginRight: '6px', fontSize: "22px" }} className={`${!open ? "menuIcon" : ""}`} />    {!collapsed && 'People'}
        </Menu.Item>
        {/* <Menu.Item onClick={handleNavigate} key="/notification" icon=
          {


            <div style={{ position: "relative" }}>

              {
                notficationCount > 0 &&
                <span style={!collapsed ? { position: 'absolute', top: '-23px', right: "-5px" } : { position: 'absolute', top: '-13px', right: "-03px" }}>
                  <strong style={{ fontSize: "35px", color: "red" }}>
                    ·
                  </strong>
                </span>
              }
              <BellOutlined />

            </div>

          }>

          {!collapsed && 'Notification'}
        </Menu.Item> */}
        <Menu.Item onClick={handleNavigate} key={`/user/${user?._id}`} >
            <UserOutlined style={{ marginRight: '6px', fontSize: "22px" }} className={`${!open ? "menuIcon" : ""}`} />{!collapsed && 'User'}
        </Menu.Item>
      </Menu>
    </Sider>
    </div>
  );
};

export default Sidenavbar;
