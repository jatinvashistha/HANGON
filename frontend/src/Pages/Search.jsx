import React, { useState } from 'react';
import { Input, Button, AutoComplete, List, Avatar } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers } from '../Middleware';
import { useNavigate } from 'react-router-dom'
import { anyUser } from '../Redux/Actions/User';

const Search = () => {
  const [autoCompleteValue, setAutoCompleteValue] = useState('');
  const navigate = useNavigate();
  const { loading, users } = useSelector((state) => (state.searchUser))
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (value) => {

    searchUsers(dispatch, value);

    // setLoading(true);

    // // Perform your search logic here and update searchResults
    // // For demonstration purposes, let's just show a dummy list
    // setTimeout(() => {
    //   const dummyResults = Array.from({ length: 5 }, (_, index) => `Result ${index + 1}`);
    //   setSearchResults(dummyResults);
    //   setLoading(false);
    // }, 1500); // Simulating a delay for the search
  };

  const dataSource = users?.map((result) => ({
    value: result._id,
    label: <div>
      <Avatar
        src={result?.avatar?.url}
      />

     <span style ={{color : "white"}}> {result.name} </span></div>,
  }));

  return (
    <div className = "navSearch"> 

 
    <AutoComplete
    className='autoSearch'
        value={autoCompleteValue}
      options={dataSource}
      onSelect={(value) => {
        setAutoCompleteValue("")
        dispatch(anyUser(value))
        navigate(`/user/${value}`)
        

      }}
      onSearch={handleSearch}
      
      placeholder=" Search...."
        onChange={(e) => {
          setAutoCompleteValue(e)
        }}
    >

    </AutoComplete>
    </div>
  );
};

export default Search;
