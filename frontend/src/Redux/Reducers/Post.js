import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    loading: false,
    posts: {},
    err: null,
  },
  reducers: {
    postOfFollowingRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },

    postOfFollowingSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        posts: action.payload,
      };
    },
    postOfFollowingFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        err: action.payload.toString(),
      };
    },
    clearErrors: (state) => {},
  },
});

export const likeAndUnlikeSlice = createSlice({
  name: "likeAndUnlike",
  initialState: {
    loading: false,
    message: null,
    err: null,
  },
  reducers: {
    likeRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    likeSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    },
    likeFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        err: action.payload.toString(),
      };
    },
    newPostRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    newPostSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    },
    newPostFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        err: action.payload.toString(),
      };
    },
    clearErrors: (state, action) => {
      return {
        ...state,
        err: null,
      };
    },
    clearMessage: (state, action) => {
      return {
        ...state,
        message: null,
      };
    },
  },
});
export const likeAndUnlikeCommentSlice = createSlice({
  name: "likeAndUnlikeComment",
  initialState: {
    loading: false,
    message: null,
    err: null,
  },
  reducers: {
    likeAndUnlikeCommentRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    likeAndUnlikeCommentSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    },
    likeAndUnlikeCommentFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        err: action.payload.toString(),
      };
    },
    clearErrors: (state, action) => {
      return {
        ...state,
        err: null,
      };
    },
    clearMessage: (state, action) => {
      return {
        ...state,
        message: null,
      };
    },
  },
});
export const addPostSlice = createSlice({
  name: "addPost",
  initialState: { loading: false },
  reducers: {
    addPostRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    addPostSuccess: (state, action) => {
      return {
        ...state,
        post: action.payload,
      };
    },
    addPostFailure: (state, action) => {
      return {
        ...state,
        err: action.payload,
      };
    },
  },
});
export const addCommentSlice = createSlice({
  name: "addComment",
  initialState: { loading: false },
  reducers: {
    addCommentRequest: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    addCommentSuccess: (state, action) => {
      return {
        ...state,
        post: action.payload,
      };
    },
    addCommentFailure: (state, action) => {
      return {
        ...state,
        err: action.payload,
      };
    },
  },
});
export const deleteCommentSlice = createSlice({
  name: "deleteComment",
  initialState: { loading: false },
  reducers: {
    deleteCommentRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    deleteCommentSuccess: (state, action) => {
      return {
        ...state,
        post: action.payload,
      };
    },
    deleteCommentFailure: (state, action) => {
      return {
        ...state,
        err: action.payload,
      };
    },
  },
});
export const anyPostSlice = createSlice({
  name: "anyPost",
  initialState: { loading: false },
  reducers: {
    anyPostRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    anyPostSuccess: (state, action) => {
   
      return {
        ...state,
        loading : false,
        post: action.payload,
      };
    },
    anyPostFailure: (state, action) => {
      return {
        ...state,
        err: action.payload,
      };
    },
  },
});

export const changeCaptionSlice = createSlice({
  name: "changeCaption",
  initialState: { loading: false },
  reducers: {
    changeCaptionRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    changeCaptionSuccess: (state, action) => {
      return {
        ...state,
        message: action.payload,
      };
    },
    changeCaptionFailure: (state, action) => {
      return {
        ...state,
        err: action.payload,
      };
    },
  },
});

export const deletePostSlice = createSlice({
  name: "deletePost",
  initialState: { loading: false },
  reducers: {
    deletePostRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    deletePostSuccess: (state, action) => {
      return {
        ...state,
        message: action.payload,
      };
    },
    deletePostFailure: (state, action) => {
      return {
        ...state,
        err: action.payload,
      };
    },
  },
});

export const savePostSlice = createSlice({
  name :"SavePost",
    initialState: { loading: false },
  reducers : {
    savePostRequest : (state, action) =>{
      return {
        ...state,
        loading: true,
      };

    },
    savePostSuccess : (state, action) =>{
      return {
        ...state,
        message : action.payload,
      };

    },
    savePostFailure :(state, action) =>{
      return {
        ...state,
        err: action.payload,
      };
    }
  }
})
export const interestedPostSlice = createSlice({
  name :"interestedPost",
    initialState: { loading: false },
  reducers : {
    interestedPostRequest : (state, action) =>{
      return {
        ...state,
        loading: true,
      };

    },
    interestedPostSuccess : (state, action) =>{
      return {
        ...state,
        message : action.payload,
      };

    },
    interestedPostFailure :(state, action) =>{
      return {
        ...state,
        err: action.payload,
      };
    }
  }
})
export const {
  interestedPostFailure,interestedPostRequest,interestedPostSuccess
}
 = interestedPostSlice.actions;


export const {likeAndUnlikeCommentRequest,likeAndUnlikeCommentFailure,likeAndUnlikeCommentSuccess} = likeAndUnlikeCommentSlice.actions

export const {
  postOfFollowingFailure,
  postOfFollowingSuccess,
  postOfFollowingRequest,
} = postSlice.actions;
export const { addPostFailure, addPostRequest, addPostSuccess } =
  addPostSlice.actions;
export const { addCommentFailure, addCommentRequest, addCommentSuccess } =
  addCommentSlice.actions;

export const {
  likeFailure,
  likeSuccess,
  likeRequest,
  clearMessage,
  clearErrors,
  newPostRequest,
  newPostSuccess,
  newPostFailure,
} = likeAndUnlikeSlice.actions;

export const { anyPostFailure, anyPostRequest, anyPostSuccess } =
  anyPostSlice.actions;
export const {
  changeCaptionFailure,
  changeCaptionRequest,
  changeCaptionSuccess,
} = changeCaptionSlice.actions;

export const {
  deleteCommentFailure,
  deleteCommentRequest,
  deleteCommentSuccess,
} = deleteCommentSlice.actions;

export const {deletePostFailure,deletePostRequest,deletePostSuccess} = deletePostSlice.actions
export const {savePostRequest,savePostFailure,savePostSuccess} = savePostSlice.actions