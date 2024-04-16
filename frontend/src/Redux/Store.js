
import { configureStore } from "@reduxjs/toolkit";
import userSlice, { blockUserSlice, changePasswordSlice, commentedPostSlice, followSlice, likedPostSlice, removeFollowerSlice, updateProfileSlice } from "./Reducers/User";

import allUserSlice, { allUsersWithFollwingSlice, anyUserSlice, searchUserSlice } from "./Reducers/allUsers";
import { addCommentSlice, anyPostSlice, changeCaptionSlice, deletePostSlice, interestedPostSlice, likeAndUnlikeCommentSlice, likeAndUnlikeSlice, postSlice, savePostSlice } from "./Reducers/Post";

import { themeSlice } from "./Reducers/Theme";
import { AddOrSeeSlice, addToGroupSlice, allMessageSlice, deleMessagesSlice, deleteChatSlice, fetchChatSlice, fetchSingleChatSlice, makeGroupSlice, removeFromGroupSlice, renameGroupSlice, seenMessageSlice, sendMessageSlice } from "./Reducers/Chat";
import { notificationSlice, seenNotificationSlice } from "./Reducers/Notifications";


const store = configureStore({
    reducer : {
        user : userSlice.reducer,
        post : postSlice.reducer,
        allUser : allUserSlice.reducer,
        likeAndUnlike : likeAndUnlikeSlice.reducer ,
        followAndUnfollow : followSlice.reducer,
        updateProfile : updateProfileSlice.reducer,
        anyUser : anyUserSlice.reducer,
        seenNotifications : seenNotificationSlice.reducer,
        getAllNotifications : notificationSlice.reducer,
        changePassword : changePasswordSlice.reducer,
        addComment : addCommentSlice.reducer,
        addOrSee : AddOrSeeSlice.reducer,
        fetchChat : fetchChatSlice.reducer,
        makeGroup : makeGroupSlice.reducer,
        renameGroup : renameGroupSlice.reducer,
        addToGroup : addToGroupSlice.reducer,
        removeFromGroup : removeFromGroupSlice.reducer,
        sendMessage : sendMessageSlice.reducer,
        allMessage : allMessageSlice.reducer
        ,theme :themeSlice.reducer,
        anyPost : anyPostSlice.reducer,
        deletePost : deletePostSlice.reducer,
        changeCaption :changeCaptionSlice.reducer,
        savePost : savePostSlice.reducer,
        interestedPost : interestedPostSlice.reducer,
        searchUser : searchUserSlice.reducer,
        deleteChat : deleteChatSlice.reducer,
        seenMessage : seenMessageSlice.reducer,
        blockUser : blockUserSlice.reducer,
        allUserWithFollowing : allUsersWithFollwingSlice.reducer,
        likeAndUnlikeComment : likeAndUnlikeCommentSlice.reducer,
        deleteMessage: deleMessagesSlice.reducer,
        likedPosts: likedPostSlice.reducer,
        commentedPost: commentedPostSlice.reducer,
        singleChat: fetchSingleChatSlice.reducer,
        removeFollower : removeFollowerSlice.reducer
    },
    
 
    devTools: process.env.NODE_ENV !== 'production',

}

);
export default store;