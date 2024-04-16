import React from 'react'
import ChatUsers from '../Component/Chat/ChatUsers'
import { useDispatch } from 'react-redux';
import { fetchChat } from '../Redux/Actions/Chat';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const params = useParams()

  const dispatch = useDispatch();
  const fetchChats = async () => {

    try {
      await dispatch(fetchChat())

    } catch (e) {

    }
  }
  useEffect(() => {
    fetchChats();
  }, [])

  return (
    <div>
      <ChatUsers/>
      

      
    </div>
  )
}

export default Chat