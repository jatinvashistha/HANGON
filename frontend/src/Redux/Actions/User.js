import axios from 'axios';
import { LoadUserFailure, LoadUserRequest, LoadUserSuccess, LoginFailure, LoginRequest, LoginSuccess, RegisterFailure, RegisterRequest, RegisterSuccess, blockUserFailure, blockUserRequest,  blockUserSuccess, changePasswordRequest, changePasswordSuccess, clearErrors, commentedPostFailure, commentedPostRequest, commentedPostSuccess, followFailure, followRequest, followSuccess, likedPostRequest, updateProfileRequest, updateProfileSuccess } from '../Reducers/User';
import Cookies from 'js-cookie';
import { allUserRequest, allUsersFailure, allUsersSuccess, allUsersWithFollwingFailure, allUsersWithFollwingRequest, allUsersWithFollwingSuccess, anyUserRequest, anyUserSuccess, searchUserFailure, searchUserRequest, searchUserSuccess, seenNotificationsRequest } from '../Reducers/allUsers';
import { likeAndUnlikeCommentFailure, likeAndUnlikeCommentSuccess, newPostRequest } from '../Reducers/Post';
import { BASE_URL } from '../../config';


export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      email,
      password,
    });

    Cookies.set("token", response.data.token, { expires: 90 });
    return response.data;
  } catch (error) {
    console.error("Error in login:", error);
  }
};

export const signUpUser = async (email, password, name, username) =>  {
    try {
        // await dispatch(RegisterRequest());
        console.log(email, password, name, username);
 
     const { data} =   await axios.post(`${BASE_URL}/register`,{
        email, password,name , username
     });
        Cookies.set('token', data.token, { expires: 90 });
        return data;
    
    //  await dispatch(RegisterSuccess(data.user));
    //  await dispatch(clearErrors());

    }catch(e) {
        console.log(e?.response?.data?.message,'the error mess');
        // dispatch(RegisterFailure(e?.response?.data?.message));
    }
}

export const loadUser = ( ) => async(dispatch) => {
    try {
       dispatch(LoadUserRequest())
   const {data}  =     await  axios.get(`${BASE_URL}/me`, {
        withCredentials: true}) 
      
      await  dispatch(LoadUserSuccess(data.user))
    }catch(e) {
      
        dispatch(LoadUserFailure(e.message));
    }
}
export const getAllUsers = () => async(dispatch) => {
    try {
        dispatch(allUserRequest());
        const {data} = await axios.get(`${BASE_URL}/users`,{
            withCredentials : true
        })
        dispatch(allUsersSuccess(data.users))

    }catch(e) {
        dispatch(allUsersFailure(e.message))
        console.log(e);
    }
}
export const getAllUsersWithFollowing = () => async(dispatch) => {
    try {
        dispatch(allUsersWithFollwingRequest());
        const {data} = await axios.get(`${BASE_URL}/allusers`,{
            withCredentials : true
        })
        dispatch(allUsersWithFollwingSuccess(data.users))

    }catch(e) {
        dispatch(allUsersWithFollwingFailure(e.message))
        console.log(e);
    }
}
export const newPost = (img,caption) => async (dispatch) => {
    try {
    dispatch(newPostRequest());
    const {data} = await axios.post(`${BASE_URL}/post/upload`,{
        caption,
        
    })

    }catch(e) {

    }
}
export const followAndUnfollow = (id) =>async (dispatch)=>{
    try {
        dispatch(followRequest())
        const {data} = await axios.put(`${BASE_URL}/follow/${id}`,null,{
            withCredentials : true
        })
        dispatch(followSuccess(data.message))


    }catch(e) {
        dispatch(followFailure(e.response.data.message))
    }
}
export const updateProfile = (name,email,username,bio,avatar) => async(dispatch) =>{
    try {
       
        dispatch(updateProfileRequest());
        const {data} = await axios.put(`${BASE_URL}/update/profile`,{
name,email,username,bio,avatar
        },{
            withCredentials : true
        })
      dispatch(updateProfileSuccess(data.message))

    }catch(e) {


    }
}

export const anyUser = (id) =>async (dispatch) =>{
    try {
        dispatch(anyUserRequest());
        const {data} = await axios.get(`${BASE_URL}/user/${id}`,{
            withCredentials : true
        })
        dispatch(anyUserSuccess(data.user))

    }catch(e) {
        console.log(e)
    }

}

// export const changePassword = async (oldPassword, newPassword) => {
//   try {
//     const res = await axios.put(
//       "http://localhost:4000/api/v1/update/password",
//       {
//         oldPassword,
//         newPassword,
//       },
//       {
//         withCredentials: true,
//       }
//     );
//     console.log("Response:", res); // Log the full response object
//     return res.data;
//   } catch (e) {
//     console.error("Error:", e); // Log any errors that occur
//    // Rethrow the error to propagate it further if needed
//   }
// };

export const likedPosts = () => async (dispatch) =>{
    try {
    dispatch(likedPostRequest());
    const {data} = await axios.put(`${BASE_URL}/likedpost`,{
        withCredentials : true
    })
    dispatch(likeAndUnlikeCommentSuccess(data.posts))

    }catch(e) {
        console.log(e);
        dispatch(likeAndUnlikeCommentFailure(e.message))
    }

}
export const commentedPosts = () => async (dispatch) =>{
    try {
    dispatch(commentedPostRequest());
    const {data} = await axios.put(`${BASE_URL}/likedpost`,{
        withCredentials : true
    })
    dispatch(commentedPostSuccess(data.posts))

    }catch(e) {
        console.log(e);
        dispatch(commentedPostFailure(e.message))
    }

}

export const searchUser = (param) =>async(dispatch) =>{
try {
    
    dispatch(searchUserRequest());
    const {data} = await axios.get(`${BASE_URL}/user?search=${param}`,{
        withCredentials : true
    });
    
    dispatch(searchUserSuccess(data?.users))

}catch(e){
    dispatch(searchUserFailure(e.message))
}

}
export const blockUser = (userId) =>async(dispatch) =>{
try {
    
    dispatch(blockUserRequest());
  
    const {data} = await axios.put(`${BASE_URL}/blockuser` , {
        userId 
    },{
        withCredentials : true
    });
    
    dispatch(blockUserSuccess(data?.message))

}catch(e){
    console.log(e)
    dispatch(blockUserFailure(e.message))
}

}
export const checkusername = async(username) =>{
try {
    
    const {data} = await axios.put(`${BASE_URL}/checkusername`  ,{
        username 
    },{
        withCredentials : true
    });
    return data
 

}catch(e){
    console.log(e)
   
}

}
export const checkemail = async(email) =>{
try {
    
    const {data} = await axios.put(`${BASE_URL}/checkemail`,{
        email 
    },{
        withCredentials : true
    });
    return data
}catch(e){
    console.log(e)
   
}

}