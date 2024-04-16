import { createSlice } from "@reduxjs/toolkit";
export  const notificationSlice = createSlice({
    name : 'getNotifications',
      initialState: { loading: false },
    reducers : {
        getNotificationsRequest : (state,action) =>{
            return {
                ...state, loading : true
            }

        },
        getNotificationsSuccess : (state,action) =>{
            return {
                ...state, loading : false,
                notification : action.payload
            }

        },
        getNotificationsFailure : (state,action) =>{
            return {
                ...state, loading : false,
                err : action.payload
            }

        },
    }
    
})
export  const seenNotificationSlice = createSlice({
    name : 'seenNotification',
      initialState: { loading: false },
    reducers : {
        seenNotificationRequest : (state,action) =>{
            return {
                ...state, loading : true
            }

        },
        seenNotificationSuccess : (state,action) =>{
            return {
                ...state, loading : false,
                notification : action.payload
            }

        },
        seenNotificationFailure : (state,action) =>{
            return {
                ...state, loading : false,
                err : action.payload
            }

        },
    }
    
})



export const {
    getNotificationsFailure,
    getNotificationsSuccess,
    getNotificationsRequest
  } = notificationSlice.actions;
  
  export const {
    seenNotificationFailure,
    seenNotificationSuccess,
    seenNotificationRequest
  } = seenNotificationSlice.actions;
  