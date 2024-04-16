import { createSlice } from "@reduxjs/toolkit";

export const AddOrSeeSlice = createSlice({
  name: "AddOrSeeChat",
  initialState: { loading: false },
  reducers: {
    AddOrSeeRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    AddOrSeeSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        chat: action.payload,
      };
    },
    AddOrSeeFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        err: action.payload,
      };
    },
  },
});
export const fetchChatSlice = createSlice({
  name: "fetchChat",
  initialState: {},
  reducers: {
    fetchChatRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    fetchChatSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        chats: action.payload,
      };
    },
    fetchChatFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        err: action.payload,
      };
    },
  },
});
export const makeGroupSlice = createSlice({
  name: "makeGroup",
  initialState: { loading: false },
  reducers: {
    makeGroupRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    makeGroupSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        chat: action.payload,
      };
    },
    makeGroupFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        err: action.payload,
      };
    },
  },
});
export const renameGroupSlice = createSlice({
  name: "renameGroup",
  initialState: { loading: false },
  reducers: {
    renameGroupRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    renameGroupSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        message : action.payload,
      };
    },
    renameGroupFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        err: action.payload,
      };
    },
  },
});
export const addToGroupSlice = createSlice({
  name: "addToGroup",
  initialState: { loading: false },
  reducers: {
    addToGroupRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    addToGroupSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    },
    addToGroupFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        err: action.payload,
      };
    },
  },
});
export const removeFromGroupSlice = createSlice({
  name: "removeFromGroup",
  initialState: { loading: false },
  reducers: {
    removeFromGroupRequest: (state, action) => {
      return {
        ...state,
        loading: true,
      };
    },
    removeFromGroupSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    },
    removeFromGroupFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        err: action.payload,
      };
    },
  },
});
export const sendMessageSlice = createSlice({
  name: "sendMessage",
  initialState: { loading: false },
  reducers: {
    sendMessageRequest: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    sendMessageSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    },
    sendMessageFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        err: action.payload,
      };
    },
  },
});
export const allMessageSlice = createSlice({
  name: "allMessage",
  initialState: { loading: false },
  reducers: {
    allMessageRequest: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    allMessageSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        messages : action.payload,
      };
    },
    allMessageFailure: (state, action) => {
      return {
        ...state,
        loading: false,
        err: action.payload,
      };
    },
  },
});


export const deleteChatSlice = createSlice({
  name : 'deleteChat',
    initialState: { loading: false },
  reducers : {
    deleteChatRequest : (state,action) =>
    {
      return {
        ...state,loading : true
      }
    },
    deleteChatSuccess : (state,action) =>{
      return {
        ...state,loading : false,
        message : action.payload
      }
    },
    deleteChatFailure : (state,action) =>{
return {
  ...state, err : action.payload
}

    },
  }

})

export const seenMessageSlice = createSlice({
  name : "seenMessage",
    initialState: { loading: false },
  reducers : {
    seenMessageRequest : (state,action) =>
    {
      return {
        ...state,loading : true
      }
    },
    seenMessageSuccess : (state,action) =>{
      return {
        ...state,loading : false,
        message : action.payload
      }
    },
    seenMessageFailure : (state,action) =>{
return {
  ...state, err : action.payload
}

    },
  }
  

})
export const deleMessagesSlice = createSlice({
  name : "deleteMessage",
    initialState: { loading: false },
  reducers : {
    deleteMessageRequest : (state,action) =>
    {
      return {
        ...state,loading : true
      }
    },
    deleteMessageSuccess : (state,action) =>{
      return {
        ...state,loading : false,
        message : action.payload
      }
    },
    deleteMessageFailure : (state,action) =>{
return {
  ...state, err : action.payload
}

    },
  }
})
export const fetchSingleChatSlice = createSlice({
  name : "fetchSingleChat",
    initialState: { loading: false },
  reducers : {
    fetchSingleChatRequest : (state,action) =>
    {
      return {
        ...state,loading : true
      }
    },
    fetchSingleChatSuccess : (state,action) =>{
      return {
        ...state,loading : false,
        chat : action.payload
      }
    },
    fetchSingleChatFailure : (state,action) =>{
return {
  ...state, err : action.payload
}

    },
  }
})


export const {deleteMessageRequest,deleteMessageSuccess, deleteMessageFailure} = deleMessagesSlice.actions
export const {seenMessageRequest,seenMessageSuccess,seenMessageFailure} = seenMessageSlice.actions
export const {deleteChatRequest,deleteChatFailure,deleteChatSuccess}  = deleteChatSlice.actions;
export const { AddOrSeeFailure, AddOrSeeRequest, AddOrSeeSuccess } =
  AddOrSeeSlice.actions;
export const { fetchChatFailure, fetchChatSuccess, fetchChatRequest } =
  fetchChatSlice.actions;
export const { makeGroupFailure, makeGroupRequest, makeGroupSuccess } =
  makeGroupSlice.actions;
export const { renameGroupFailure, renameGroupRequest, renameGroupSuccess } =
  renameGroupSlice.actions;
export const { addToGroupFailure, addToGroupRequest, addToGroupSuccess } =
  addToGroupSlice.actions;
export const {
  removeFromGroupFailure,
  removeFromGroupRequest,
  removeFromGroupSuccess,
} = removeFromGroupSlice.actions;
export const { sendMessageSuccess, sendMessageRequest, sendMessageFailure } =
  sendMessageSlice.actions;

export const { allMessageFailure, allMessageRequest, allMessageSuccess } =
  allMessageSlice.actions;
export const {fetchSingleChatFailure,fetchSingleChatSuccess,fetchSingleChatRequest} = fetchSingleChatSlice.actions