import { Input } from 'antd';
import React from 'react'

const CustomSearch = ({
    users, setDataList
}) => {
    const searchItem = (valuee) => {

        if (valuee === "") {
            setDataList([...users])
        }
        else {
            const filteredData = users.filter(item =>
                item.user.name.toLowerCase().includes(valuee.toLowerCase())
            );
            setDataList([...filteredData]);
        }
    }


    return (
        <span>   <Input style={{ margin: '15px 0px 10px 0px' }} onChange={async (e) => {
            searchItem(e.target.value)
        }} /></span>
    )
}

export default CustomSearch