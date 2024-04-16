import { CloseOutlined } from '@ant-design/icons';
import { AutoComplete, Avatar, Button, Card, Input, Space, message } from 'antd';
import React, { useInsertionEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers } from '../../Middleware';
import { fetchChat, makeGroup } from '../../Redux/Actions/Chat';
import { useNavigate } from 'react-router-dom';



const GroupFormation = ({setIsModalOpen}) => {
    const navigate =useNavigate();
    const [autoCompleteValue, setAutoCompleteValue] = useState('');
    const [groupName, setGroupName] = useState('');
  const {  users } = useSelector((state) => state.searchUser);
const [loading , setLoading]  = useState(false)

  const dispatch = useDispatch();

 
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSearch = (value) => {
    searchUsers(dispatch, value);
  };

  const handleUserSelect = (value, option) => {
    const selectedUser = users.find((user) => user._id === value);
  
    setAutoCompleteValue("")
    if (selectedUser) {
        const selectUser = selectedUsers.find((user) =>  selectedUser?._id == user?._id)
        if(selectUser) {
            message.warning(`${selectedUser.name} already in the group`)
        }
        else {
            setSelectedUsers([...selectedUsers, selectedUser]);
            message.success(`${selectedUser.name} added to the group.`);
        }
    }
    setAutoCompleteValue("")

  };

  const removeUser = (userId) => {
    const updatedUsers = selectedUsers.filter((user) => user._id !== userId);
    setSelectedUsers(updatedUsers);
  };

  const dataSource = users?.map((result) => ({
    value: result._id,
    label: (
      <div>
        <Avatar src={result?.avatar?.url} />
        {result.name}
      </div>
    ),
  }))
  const handleGroup = async() =>{

    try {
        if(selectedUsers.length>=2 && groupName) {
            setLoading(true)

         await   dispatch(makeGroup(groupName,JSON.stringify(selectedUsers)))
        await dispatch(fetchChat())
       

              navigate( `/chats`)
              setIsModalOpen(false);
              setLoading(false)

        }else {
            message.warning("Please provide a valid group name and select at least 2 group members.")
        }
    }catch(e) {
        console.log(e)
    }
  }


  return (
    <div style={{ margin: '23px' }}>
      <Input
      value = {groupName}
      onChange={(e) => setGroupName(e.target.value)}
      required = {true}
        className="loginInput" type='text' style={{ width: "100%" }}
      placeholder="Enter Group Name" />
      <div>
        <Space style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px', width: '100%' }}>
          {selectedUsers.map((selectedUser) => (
            <Button key={selectedUser._id} type="primary" style={{ display: 'flex', marginRight: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar size={22} src={selectedUser?.avatar?.url} />
                <span style={{ marginLeft: '8px' }}>{selectedUser.name}</span>
                <CloseOutlined style={{ marginLeft: '8px' }} onClick={() => removeUser(selectedUser._id)} />
              </div>
            </Button>
          ))}
        </Space>
      </div>

      <AutoComplete
        className="loginInput" type='text' 
        style={{ width: '100%', marginTop: '10px',border : "none",borderRadius  : "1px" }}
        options={dataSource}
        onSelect={handleUserSelect} 
        onSearch={handleSearch}
        placeholder="Search here...."
        onChange={(e) =>{
            setAutoCompleteValue(e)
        }}
       value={autoCompleteValue}
      ></AutoComplete>
      <div style = {{marginTop : "22px" , display : 'flex', alignItems : "center" , justifyContent : "flex-end"}}>

        <Button className='loginButton' loading={loading} style={{ marginRight: "10px", width: "150px"}}  type = "primary" onClick={handleGroup} >
        Create Group
      </Button>
        <Button
          className='loginButton' style={{ width: "150px" , backgroundColor : "white"}}
          
          onClick={() => setIsModalOpen(false)} >
        Cancel
      </Button>

      </div>
    </div>
  );
};

export default GroupFormation;
