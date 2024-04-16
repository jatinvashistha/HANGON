import axios from "axios";
import {
  addCommentFailure,
  addCommentRequest,
  addCommentSuccess,
  
  anyPostFailure,
  anyPostRequest,
  anyPostSuccess,
  changeCaptionFailure,
  changeCaptionRequest,
  changeCaptionSuccess,
  deleteCommentFailure,
  deleteCommentRequest,
  deleteCommentSuccess,
  deletePostFailure,
  deletePostRequest,
  deletePostSuccess,
  interestedPostFailure,
  interestedPostRequest,
  interestedPostSuccess,
  likeAndUnlikeCommentFailure,
  likeAndUnlikeCommentRequest,
  likeAndUnlikeCommentSuccess,
  likeFailure,
  likeRequest,
  likeSuccess,
  newPostFailure,
  newPostRequest,
  newPostSuccess,
  postOfFollowingFailure,
  postOfFollowingRequest,
  postOfFollowingSuccess,
  savePostFailure,
  savePostRequest,
  savePostSuccess,
} from "../Reducers/Post";
import { commentedPostFailure, commentedPostRequest, commentedPostSuccess, likedPostRequest, likedPostSuccess, removeFollowerRequest, removeFollowerSuccess } from "../Reducers/User";
import { BASE_URL } from "../../config";
import { removeFromGroupFailure } from "../Reducers/Chat";

export const getFollowingPosts = () => async (dispatch) => {
  try {
    dispatch(postOfFollowingRequest);
    const { data } = await axios.get(`${BASE_URL}/posts`, {
      withCredentials: true,
    });

    await dispatch(postOfFollowingSuccess(data.posts));
  } catch (e) {
    dispatch(postOfFollowingFailure(e));
    console.log(e);
  }
};

export const likeAndUnlikePosts = (postId) => async (dispatch) => {
  try {
    dispatch(likeRequest());
   

    const { data } = await axios.put(
      `${BASE_URL}/likeandunlike/${postId}`,null,
      {
        withCredentials: true,
      }
    );


    dispatch(likeSuccess(data.message));
  } catch (e) {
    dispatch(likeFailure(e.message));
    console.log(e);
  }
};
export const likeAndUnlikeComment = (postId,commentId) => async (dispatch) => {
  try {
    dispatch(likeAndUnlikeCommentRequest());

    const { data } = await axios.put(
      `${BASE_URL}/likeandunlikecomment/${commentId}`,{
        commentId
      },
      {
        withCredentials: true,
      }
    );
    dispatch(likeAndUnlikeCommentSuccess(data.message));
  } catch (e) {
    dispatch(likeAndUnlikeCommentFailure(e.message));
    console.log(e);
  }
};
export const uploadPic = (caption, image) => async (dispatch) => {
  try {
    dispatch(newPostRequest());
    const { data } = await axios.post(
     ` ${BASE_URL}/post/upload`,
      {
        caption,
        image,
      },
      {
        withCredentials: true,
      }
    );
   
      
    dispatch(newPostSuccess(data.post));

  } catch (e) {
    dispatch(newPostFailure(e.message));
  }
};
export const addComment = (id, comment,mention, commentId) => async (dispatch) => {
  try {

    dispatch(addCommentRequest());


    const { data } = await axios.post(

      `${BASE_URL}/post/comment/${id}`,
      {
        comment,commentId,mention
      },
      {
        withCredentials: true,
      }
    );
 

    dispatch(addCommentSuccess(data.msg));
  } catch (e) {
    console.log(e);
    dispatch(addCommentFailure(e.message));
  }
};
export const anypost = (id) => async (dispatch) => {
  try {
    dispatch(anyPostRequest());
    const { data } = await axios.get(
      `${BASE_URL}/post/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch(anyPostSuccess(data?.postData));
  } catch (e) {
    dispatch(anyPostFailure(e.message));
  }
};
export const deletePost = (id) => async (dispatch) => {
  try {
    dispatch(deletePostRequest());
  
    const { data } = await axios.delete(
      `${BASE_URL}/post/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch(deletePostSuccess(data.message));
  } catch (e) {
    dispatch(deletePostFailure(e.message));
  }
};
export const changeCaption = (id, caption) => async (dispatch) => {
  try {
    dispatch(changeCaptionRequest());

    const { data } = await axios.put(
      `${BASE_URL}/post/${id}`,
      { caption },
      { withCredentials: true }
    );
    console.log(data.message)

    dispatch(changeCaptionSuccess(data?.message));
  } catch (error) {
    dispatch(changeCaptionFailure(error.message));
  }
};
export const savePost = (id) => async (dispatch) => {
  try {
    dispatch(savePostRequest());
    const { data } = await axios.put(
      `${BASE_URL}/savepost`,
      {
        postId: id,
      },
      {
        withCredentials: true,
      }
    );
    console.log('saved',data)
    dispatch(savePostSuccess(data.message));
  } catch (e) {
    dispatch(savePostFailure(e.message));
  }
};
export const interestedPost = (id) => async (dispatch) => {
  try {
    dispatch(interestedPostRequest());
    const { data } = await axios.put(
     ` ${BASE_URL}/interestedpost`,
      {
        postId: id,
      },
      {
        withCredentials: true,
      }
    );
    dispatch(interestedPostSuccess(data.message));
  } catch (e) {
    dispatch(interestedPostFailure(e.message));
  }
};
export const commentDelete = (postId, commentId) => async (dispatch) => {
  try {
    dispatch(deleteCommentRequest());
    const { data } = await axios.delete(
      
      `${BASE_URL}/post/comment/${postId}`,
      {
        data: {
          commentId: commentId
        },
        withCredentials: true,
      }
    );
    console.log(data, 'the data is');
    dispatch(deleteCommentSuccess(data.message));
  } catch (e) {
    console.log(e);
    dispatch(deleteCommentFailure(e.message));
  }
};
export const liked = () => async (dispatch) => {
  try {
    dispatch(likedPostRequest());
    const { data } = await axios.get(
      `${BASE_URL}/likedpost`,{
        withCredentials: true,
      }
    );
    dispatch(likedPostSuccess(data.likes));
  } catch (e) {
    console.log(e);
    dispatch(deleteCommentFailure(e.message));
  }
};
export const commented = () => async (dispatch) => {
  try {
    dispatch(commentedPostRequest());
    const { data } = await axios.get(`${BASE_URL}/commentedpost`, {
      withCredentials: true,
    });

    dispatch(commentedPostSuccess(data?.comments));
  } catch (e) {
    console.log(e);
    dispatch(commentedPostFailure(e.message));
  }
};
export const removeFollower = (userId) => async (dispatch) => {
  try {

    dispatch(removeFollowerRequest());

    const { data } = axios.put(`${BASE_URL}/removefollower`, {
      userId
    },{
      withCredentials : true
    });
    

dispatch(removeFollowerSuccess(data.success))

  } catch (e) {
    console.log(e);
    dispatch(removeFromGroupFailure(e.message))
  }
}