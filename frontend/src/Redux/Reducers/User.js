import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loading: false,
  user: null,
  err : null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "User",
  initialState: {
    loading: false,
    user: {},
    err : "  ",
    isAuthenticated: false,
  },
  reducers: {
    LoginRequest: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    LoginSuccess: (state, action) => {
      return {
        ...state,
        user: action.payload,
        loading: false,
        isAuthenticated: true,
      };
      //   state.user = action.payload;
      //   state.loading = false;
      //   state.isAuthenticated = true
      //   console.log('the state is ', state.user);
    },
    LoginFailure: (state, action) => {
      return {
        ...state,
        // err: action.payload.toString(),
        loading: false,
        isAuthenticated: false,
      };
      // state.error = action.payload;
      // state.loading = false;
      // state.isAuthenticated = false
    },

    RegisterRequest: (state) => {
      //   state.loading = true;
    },
    RegisterSuccess: (state, action) => {
      //   state.loading = false;
      //   state.user = action.payload;
      //   state.isAuthenticated = true
    },
    RegisterFailure: (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      //   state.isAuthenticated = false
    },

    LoadUserRequest: (state) => {
     
      return {
        ...state,
        loading: true,
      };
    },
    LoadUserSuccess: (state, action) => {
      return {
        ...state,
        user: action.payload,
        loading: false,
        isAuthenticated: true,
      
      };
    },
    LoadUserFailure: (state, action) => {
      return {
        ...state,
        err : action.payload,
        loading: false,
        isAuthenticated : false
      };
    },
    clearErrors : (state) =>{
      return {
        ...state, err : null
      }
    }
  },
});



 export const followSlice = createSlice({
  name :"followAndUnfollow",
  initialState : {},
  reducers : {
    followRequest  : (state,action) =>{
      return {
        ...state,loading : true
      }
    },
    followSuccess : (state,action) =>{
      return {
        ...state, loading : true,message : action.poayload
      }
    },
    followFailure :(state,action) =>{
      return {
        ...state,
        loading : false,
        err  : action.payload.toString()
      }
    }
  }

})

export const updateProfileSlice = createSlice({
  name : 'updateprofile',
  
    initialState: { loading: false },
  reducers : {
    updateProfileRequest : (state,action) =>{

      return {
        ...state,
        loading : true
      }
    },
    updateProfileSuccess : (state,action) =>{
      return {
        ...state,
        loading  : false,
        msg : action.paylaod
      }
    },
    updateProfileFailure : (state,action) =>{
      return {
        ...state,
        loading : false,
        err : action.payload
      }
    },
  }

})


export const changePasswordSlice = createSlice({
name :"changePassword",

  initialState: { loading: false },
reducer : {
  changePasswordRequest : (state,action) =>{
    return {
      ...state,loading : true
    }
  },
  changePasswordSuccess : (state,action) =>{
    return {
      ...state,loading : false,
      msg : action.payload
    }
  },
  changePasswordFailure : (state,action) =>{
    return {
      ...state,err : action.payload,
      loading : false
    }
  }
}

}

)
export const blockUserSlice = createSlice({
  name: "blockUser",
    initialState: { loading: false },
  reducers: {
    blockUserRequest: (state, action) => {
      return {
        ...state,
        loading: true
      }
    },
    blockUserSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        msg: action.payload
      }
    },
    blockUserFailure: (state, action) => {
      return {
        ...state,
        err: action.payload,
        loading: false
      }
    }
  }
});
export const likedPostSlice = createSlice({
  name: "likedPost",
    initialState: { loading: false },
  reducers: {
    likedPostRequest: (state, action) => {
      return {
        ...state,
        loading: true
      }
    },
    likedPostSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        likedPost: action.payload
      }
    },
    likedPostFailure: (state, action) => {
      return {
        ...state,
        err: action.payload,
        loading: false
      }
    }
  }
});
export const commentedPostSlice = createSlice({
  name: "commentedPost",
    initialState: { loading: false },
  reducers: {
  commentedPostRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
  commentedPostSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        commentedPost : action.payload,
      };
    },
  commentedPostFailure: (state, action) => {
      return {
        ...state,
        err: action.payload,
        loading: false,
      };
    },
  },
});
export const removeFollowerSlice = createSlice({
  name: "removeFollower",
    initialState: { loading: false },
  reducers: {
    removeFollowerRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    removeFollowerSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        removeFollower: action.payload,
      }
    },
    removeFollowerFailure: (state, action) => {
      return {
        ...state,
        err: action.payload,
        loading: false,
      };
    },
  },
});

export const { removeFollowerFailure, removeFollowerRequest, removeFollowerSuccess } = removeFollowerSlice.actions;


export const { commentedPostFailure, commentedPostRequest, commentedPostSuccess }
= commentedPostSlice.actions

export const { likedPostFailure, likedPostRequest, likedPostSuccess } = 
likedPostSlice.actions
export const { blockUserFailure, blockUserRequest, blockUserSuccess } = blockUserSlice.actions;


export const {updateProfileFailure,updateProfileRequest,updateProfileSuccess} = updateProfileSlice.actions
export const {changePasswordFailure,changePasswordRequest,changePasswordSuccess} = changePasswordSlice.actions
export const {
  LoginRequest,
  LoginSuccess,
  LoginFailure,
  RegisterRequest,
  RegisterSuccess,
  RegisterFailure,
  LoadUserRequest,
  LoadUserSuccess,
  LoadUserFailure,
  clearErrors
} = userSlice.actions;
export const {
  followRequest,
  followFailure,
  followSuccess
} = followSlice.actions
export default  userSlice
