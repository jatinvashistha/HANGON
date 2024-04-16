import axios from "axios";
import { blockUser, followAndUnfollow, loadUser, searchUser } from "./Redux/Actions/User";
import { useSelector } from "react-redux";
import { addOrSeeChat } from "./Redux/Actions/Chat";
import { removeFollower } from "./Redux/Actions/Post";
export const imageUpload = async (e) => {
  try {
    const selectedFile = e.target.files[0];
    const data = new FormData();
    data.append("file", selectedFile);
    data.append("upload_preset", "amanpanchal");
    data.append("cloud_name", "dk2scs5jz");
    const fileName = selectedFile.name;
const fileExtension = fileName?.split('.').pop().toLowerCase();

if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {
  
  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dk2scs5jz/image/upload",
    data
  );
  

  const image = {
    public_id: res?.data?.public_id,
    url: res?.data?.url,
  };


  return { success: true, data: image };


    
} else if (['mp4', 'avi', 'mov', 'mkv', 'wmv', 'webm'].includes(fileExtension)) {
  
  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dk2scs5jz/video/upload",
    data
  );
  
  console.log(res?.data?.url)
  const image = {
    public_id: res?.data?.public_id,
    url: res?.data?.url,
  };

  return { success: true, data: image };
   
} 


  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
};

export const searchUsers = async (dispatch,param) => {
  try {
    dispatch(searchUser(param))
  } catch (e) {
    console.log(e);
  }
};
export const followButton = async (dispatch,id ) =>{
  try {
   await addOrSeeChat(id); 
    await dispatch(followAndUnfollow(id))
    await dispatch(loadUser());
   
   }catch(e){
       console.log(e)
   }


}
export const removeFollowerFromList = async (dispatch,id ) =>{
  try {
 
    await dispatch(removeFollower(id))
    await dispatch(loadUser());
   
   }catch(e){
       console.log(e)
   }


}
export const blockButton = async (dispatch,id) =>{
  try {

  await  dispatch(blockUser(id));

  await dispatch(loadUser());

  }catch(e){
    console.log(e)
  }
}
export const checkBlockedUser = (user1, user2) =>{


  
  const x = user1?.blockedUser?.find((user) =>{
    
    
    return  (user?.user?._id === user2?._id)})
  
  if(x){  
    return true;
    
  }else {


  
  return false;
  
}

}
export const checkBlockingYou = (user1,user2) =>{
  

  const x = user1?.blockingYou?.find((user) => user1.user?._id === user2?._id)
  if(x){
    

    return true;
    
  }else {

  return false;

}
}
export const fileType = (content) =>{
  const fileExtension  = content?.split('.')?.pop()?.toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
  const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);
 
 
  if(isImage == true) {
    return "image"
  }
  else if(isVideo == true) {
    return "video"
  }
  else {
    
    const checkValidJson  = (content) =>{
      try {
        JSON.parse(content);
      return true;

      }
      catch(e){
        return false;
      }

    }
    

    if(checkValidJson(content)) {
      return "post"
    }else {
      return "message"
    }
  }
}