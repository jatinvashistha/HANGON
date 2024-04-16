import { AutoComplete, Avatar, Button, message } from 'antd'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers } from '../../Middleware';
import { addToGroup, fetchChat } from '../../Redux/Actions/Chat';
import { Navigate, useNavigate } from 'react-router-dom';

const AddGroup = ({
    setIsAddMemberModalVisible,
    chatUsers,
    chatName

}) => {
    const navigate = useNavigate();
    const [autoCompleteValue, setAutoCompleteValue] = useState('');
    const { users } = useSelector((state) => state.searchUser);
    const [selectedUsers, setSelectedUsers] = useState({});
    const dispatch = useDispatch();
    const [loading,setLoading] = useState(false)
    const filteredUsers = users?.filter(user => !chatUsers.some(chatUser => chatUser._id === user._id));


    const dataSource = filteredUsers?.map((result) => ({
        value: result._id,
        label: (
            <div>
                <Avatar src={result?.avatar?.url} />
                {result.name}
            </div>
        ),
    }));
    const handleSearch = (value) => {
        searchUsers(dispatch, value);
    };
    const handleUserSelect = (value, option) => {
        const selectedUser = users.find((user) => user._id === value);
        setAutoCompleteValue("")
        if (selectedUser) {
            const selectUser = selectedUsers?._id == value

            
            if (selectUser) {
                message.warning(`${selectedUser.name} already selected`)
            }
            else {
                setSelectedUsers(selectedUser);
                message.success(`${selectedUser.name} Selected.`);
            }
        }
        setAutoCompleteValue("")

    };
    const addMember = async () =>{
        try{
            if(selectedUsers) {
                setLoading(true)
                navigate(`/chat/${chatName?._id}`)
              await   dispatch(addToGroup(selectedUsers?._id,chatName?._id))
              await dispatch(fetchChat());
              setLoading(false);
             
              setIsAddMemberModalVisible(false);
            }
            else {
                message.warning("Please Select the User")
            }
            
            
        }
        catch(e) {
            console.log(e)
            
            message.warning("There is error to add member.")

        }


    }
    return (
        <div>
            {
                selectedUsers?._id && 
            <Button type = "primary" style ={{ width : "100%" } }>
                <Avatar style ={{ marginRight : "10px"}} src = {selectedUsers?.avatar?.url}  size = {22}/>
                {
                    selectedUsers?.name
                }
            </Button>
            }
            <AutoComplete
                style={{ width: '100%', marginTop: '10px' }}
                options={dataSource}
                onSelect={handleUserSelect}
                onSearch={handleSearch}
                placeholder="Search here...."
                onChange={(e) => {
                    setAutoCompleteValue(e)
                }}
                value={autoCompleteValue}
            ></AutoComplete>
            <div style = {{ display : 'flex', alignContent : 'center', justifyContent : "flex-end", width : "100%" ,margin : "10px"}}>
                <Button loading = {loading} type = "primary" onClick = {addMember}> Add Member</Button>
                <Button onClick={() =>{setIsAddMemberModalVisible(false)}}  style = {{ marginLeft : "10px"}}  > Cancel  </Button>
            </div>
        </div>
    )
}

export default AddGroup