import React from 'react';
import { Avatar, Button, Divider, List, Space, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import './GroupChatSideBar.css'; 
import { fetchChat, fetchSingleChat, removeFromGroup } from '../../Redux/Actions/Chat';

const GroupChatSideBar = ({ chat }) => {
  const param = useParams();
    const dispatch  = useDispatch();
  const { user } = useSelector((state) => state.user);

const handleRemove = async (id) =>{
    try {
        await  dispatch(removeFromGroup(id,chat?._id))
      await dispatch(fetchChat())
      await dispatch(fetchSingleChat(param.id))
 
    }catch{
        
        
    }
}
  return (
    <div className="group-chat-sidebar">
      <div className="group-chat-sidebar-header">
        <Typography.Text strong> Admin</Typography.Text>
        <br/>
        <Space align="center" style={{ marginTop: '8px' }}>
          <Avatar  src = {chat?.groupAdmin?.avatar?.url} />
          <Typography.Text strong>{chat?.groupAdmin?.name}</Typography.Text>
        </Space>
      </div>
      <Divider>Participants</Divider>
      <List className='scrollbar menuItemsSide' style = {{  height : '58vh', overflowY : "scroll"}}
        dataSource={chat?.users?.filter((use) => use?._id !== chat?.groupAdmin?._id)}
        renderItem={(use) => (
          <List.Item
            key={use?._id}
            className="group-chat-user-item"
          >
            <Space>
              <Avatar   src = {use?.avatar?.url} />
              <span>{use.name}</span>
            </Space>
            {user?._id === chat?.groupAdmin?._id && (
              <Button onClick={ () =>{  handleRemove (use?._id)}} type="link" danger>
                Remove
              </Button>
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default GroupChatSideBar;
