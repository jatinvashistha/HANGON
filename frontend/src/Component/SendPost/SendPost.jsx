import { Avatar, Button, Card, Checkbox, Input, List, Radio, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import CustomSearch from '../CutomSearch/CustomSearch';
import { useNavigate } from 'react-router-dom';
import { anyUser } from '../../Redux/Actions/User';
import { SendOutlined } from '@ant-design/icons';
import { fetchChat, sendMessage } from '../../Redux/Actions/Chat';
import { MdPeopleAlt } from 'react-icons/md';
import ChatBarSearch from '../ChatBarSearch/ChatBarSearch';


const SendPost = ({
  post,setVisible
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const { chats } = useSelector((state) => (state.fetchChat))
    const [dataList, setDataList] = useState([])
    const [selectedValues, setSelectedValues] = useState([]);
    const [checkBox, setCheckBox] = useState({});
    const [sendingItems ,setSendingItems]= useState([])
    
    useEffect(() => {
        const fetchChats = async () => {
    
          try {
            await dispatch(fetchChat())
    
          } catch (e) {
    
          }
        }
        fetchChats();
    
      }, [])
      const selectItem= (chat) =>{
        const item =sendingItems?.find((item) => item?._id ===chat?._id);
        if(item) {
          const filteredItem = sendingItems?.filter((item) => item._id != chat?._id)
        setSendingItems([...filteredItem])
        }else {
          setSendingItems([...sendingItems,chat])
        }

      }


    const handleNavigate = (use) => {
        navigate(`/user/${use?.user?._id}`)
        dispatch(anyUser(use?.user?._id))
        // setIsModalOpen(false);

    }
    useEffect(() =>{
        if(chats?.length>0){

            setDataList([...chats])

        }
    },[chats])

    const changeSelectedValues= (id) =>{
        const index   = selectedValues.indexOf(id);
        const allValues = [...selectedValues];
        if(index == -1) {
        setSelectedValues([...selectedValues,id])
        }else {
            allValues.splice(index,1);
            setSelectedValues([...allValues])
        }
}

const sendButton = (chat) => {
  const sendingPost = {
    image : post?.imageUrl?.url,
    id : post?._id,
    owner : post?.owner
  }
  const postStringify = JSON.stringify(sendingPost);
  sendingItems.map(async (item) =>{
    await dispatch(sendMessage( item?._id, postStringify))
  })

  setVisible(false);
}


    return (
        <div style={{marginTop : "20px"}}>
            
<ChatBarSearch setDataList={setDataList} chats={chats} />
            <List className='scrollbar' style={{ margin: '5px' , maxHeight : "400px" , overflowY : "scroll" }}  >
                {
                    dataList?.map((chat,key) => {
                        return (
                            <List.Item key = {key} style={{  borderRadius: "10px", padding: "8px 7px", background: 'white' }}>
                            <Space>
                              {
                                chat?.isGroupChat ? <Avatar src="https://www.unitedxp.co.il/wp-content/plugins/profilegrid-user-profiles-groups-and-communities/public/partials/images/default-group.png" />
                                  :
                                  <Avatar
                                    src={chat?.isGroupChat ? <><MdPeopleAlt /> </> : chat?.users?.filter(item => item?._id !== user?._id)[0]?.avatar?.url}
                                  />
                              }
                              <Space direction='vertical' >
                                {
                                  chat?.isGroupChat ?
                                    <Typography.Text strong> {chat?.chatName}  </Typography.Text> :
                                    <Typography.Text strong>
                                      {chat?.users?.filter((item) => { return item?._id != user?._id })[0]?.name
                                      }
                                    </Typography.Text>
                                }
                              </Space>
                            </Space>
                            <Checkbox onClick={() => selectItem(chat)}  checked = {sendingItems?.find(item => item?._id === chat?._id)} />
                          </List.Item>
      
                        )
                    })
                }
            </List>
            <Card style = {{ display : 'flex',justifyContent : "flex-end", border : "none"}} bodyStyle ={{ padding : "5px", border : "none"}} >
                <Button  disabled = {sendingItems.length>0 ? false : true} onClick={sendButton} type = "link" icon = {<SendOutlined style = {{ fontSize : "28px"}} />}/>
            </Card>
        </div>
    )
}

export default SendPost