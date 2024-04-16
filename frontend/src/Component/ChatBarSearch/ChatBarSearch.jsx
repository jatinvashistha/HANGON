import { Input } from 'antd';
import React from 'react'
import { useSelector } from 'react-redux';

const ChatBarSearch = ({
    chats, setDataList
}) => {
    const { user } = useSelector((state) => state.user);

    const searchItem = (value) => {

        if (value === "") {
            setDataList([...chats])
        }
        else {
            const filteredItem = chats?.filter(item => {
                if(item?.isGroupChat) {
                    return item?.chatName?.toLowerCase()?.includes(value?.toLowerCase());
                }
                else {

                    return item?.users?.filter((item) => item?._id != user?._id )[0]?.name?.toLowerCase()?.includes(value?.toLowerCase())
                }
            })
            setDataList([...filteredItem]);
        }
    }


    return (
        <span>   <Input style={{ margin: '15px 0px 10px 0px' }} onChange={async (e) => {
            searchItem(e.target.value)
        }} /></span>
    )
}

export default ChatBarSearch;