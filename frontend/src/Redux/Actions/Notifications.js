import axios from "axios";
import { BASE_URL } from "../../config";
import { getNotificationsFailure, getNotificationsRequest, getNotificationsSuccess, seenNotificationFailure, seenNotificationRequest, seenNotificationSuccess } from "../Reducers/Notifications";

export const seenNotifications = () =>async (dispatch) =>{
    try {
        dispatch(seenNotificationRequest());
        const {data} =await axios.put(`${BASE_URL}/notifications`,null,{
            withCredentials : true
        })
        console.log(data);
        dispatch(seenNotificationSuccess(data.notifications))
    }catch(e){
        dispatch(seenNotificationFailure(e.message))
    }
}
export const allNotifications = () =>async (dispatch) =>{
    try {
        dispatch(getNotificationsRequest());
        const {data} =await axios.get(`${BASE_URL}/notifications`,{
            withCredentials : true
        })
        
        dispatch(getNotificationsSuccess(data.notifications))
    }catch(e){
        dispatch(getNotificationsFailure(e.message))
    }
}