import { createSlice } from "@reduxjs/toolkit";
const allUserSlice = createSlice({
  name: "allusers",
  initialState: {
    loading : false
  },
  reducers: {
    allUserRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    allUsersSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        allUsers: action.payload,
      };
    },
    allUsersFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        err: action.payload.toString(),
      };
    },
  },
});
export const allUsersWithFollwingSlice = createSlice({
  name: "allUsersWithFollwing",
  initialState: { loading: false },
  reducers: {
    allUsersWithFollwingRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    allUsersWithFollwingSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        allUsers: action.payload,
      };
    },
    allUsersWithFollwingFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        err: action.payload.toString(),
      };
    },
  },
});






export const anyUserSlice = createSlice({
  name: "anyUser",
  initialState: { loading: false },
  reducers: {
    anyUserRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    anyUserSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        user: action.payload,
      };
    },
    anyUserFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        err: action.payload,
      };
    },
  },
});

export const seenNotificationsSlice = createSlice({
  name: "seenNotifications",
  initialState: { loading: false },
  reducers: {
    seenNotificationsRequest: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
  },
  seenNotificationsSuccess: (state, action) => {
    return {
      ...state,
      loading: false,
      msg: action.payload,
    };
  },
  seenNotificationsFailure: (state, action) => {
    return {
      ...state,
      loading: false,
      err: action.payload,
    };
  },
});

export const searchUserSlice = createSlice({
  name :"searchuser",
  initialState : {},
  reducers : {
    searchUserRequest : (state) =>{
      return {
        ...state,loading : true
      }
    },
    searchUserSuccess : (state,action) =>{
      return {
        ...state, users : action.payload

      }
    },
    searchUserFailure : (state,action) =>{
      return {
        ...state,
        loading: false,
        err: action.payload,
      };

    }
  },

})

export const {allUsersWithFollwingRequest,allUsersWithFollwingFailure,allUsersWithFollwingSuccess} = allUsersWithFollwingSlice.actions


export const {searchUserFailure,searchUserRequest,searchUserSuccess} = searchUserSlice.actions







export const {
  seenNotificationsFailure,
  seenNotificationsRequest,
  seenNotificationsSuccess,
} = seenNotificationsSlice.actions;
export const { anyUserFailure, anyUserSuccess, anyUserRequest } =
  anyUserSlice.actions;
export const { allUserRequest, allUsersFailure, allUsersSuccess } =
  allUserSlice.actions;
export default allUserSlice;
