import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Component/Navbar/Navbar";
import Sidenavbar from "./Component/Sidenavbar/Sidenavbar";
import Account from "./Pages/Account";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Newpost from "./Pages/Newpost";
import Search from "./Pages/Search";
import {
  getAllUsersWithFollowing,
  loadUser
} from "./Redux/Actions/User";
import "./index.css";

import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import EditProfile from "./Component/EditProfile/EditProfile";
import Post from "./Component/Post/Post";
import AnyPost from "./Pages/AnyPost";
import BlockedUser from "./Pages/BlockedUser";
import Chat from "./Pages/Chat";
import CommentedPost from "./Pages/CommentedPost";
import ForgetPassword from "./Pages/ForgetPassword";
import LikedPost from "./Pages/LikedPost";
import Network from "./Pages/Network";
import Notification from "./Pages/Notification";
import Signup from "./Pages/Signup";
import UserChat from "./Pages/UserChat";
import { fetchChat } from "./Redux/Actions/Chat";
import { allNotifications } from "./Redux/Actions/Notifications";
import { socket, socketInitial } from "./Socket";


const App = () => {

  const dispatch = useDispatch();

  const [isAuthenticated, setAuthenticated] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const { allUsers } = useSelector((state) => state.allUser);
  const [notficationCount, setNotificationCount] = useState(0);
  const { user } = useSelector((state) => state.user);
  const { notification } = useSelector((state) => state.getAllNotifications);
  const state = useSelector((state) => state);
  const { sendMessage } = useSelector((state) => state.sendMessage);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(loadUser());
        await dispatch(getAllUsersWithFollowing());
      } catch (e) {
        console.log(e);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    socketInitial(user);
  }, [user]);

  useEffect(() => {
    setAuthenticated(state?.user?.isAuthenticated);
  }, [state]);

  useEffect(() => {
    dispatch(fetchChat());
  }, []);

  
  const calculateNotificationCount = () => {
    return notification?.reduce(
      (count, set) => (set?.isRead === false ? count + 1 : count),
      0
    );
  };





  useEffect(() => {
    // dispatch(allNotifications());
    const x = calculateNotificationCount()
  
    setNotificationCount(x);
  }, [notification]);


  useEffect(() => {
    dispatch(allNotifications());

  }, []);

  useEffect(() => {
    socket.on("connecte", () => {
      console.log("socket is connected well");
    });
  }, []);

  useEffect(() => {
    dispatch(allNotifications());
  }, []);

  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat/");

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <Layout theme="dark">
            {!isChatPage && <Navbar notficationCount={notficationCount} />}
            <Content>
              <Layout className="appLayout" theme="dark">
                {/* <Sidenavbar /> */}
                {!isChatPage && <Sidenavbar />}
                <Content theme="dark">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/post" element={<Newpost />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/network" element={<Network />} />
                    {/* <Route path="/me" element={<Account />} />  */}
                    <Route
                      notficationCount={notficationCount}
                      path="/notification"
                      element={<Notification />}
                    />
                    <Route path="/editprofile" element={<EditProfile />} />

                    <Route path="/post/:id" element={<Post />} />
                    <Route path="/user/:id" element={<Account />} />
                    <Route path="/chats" element={<Chat />} />
                    <Route path="/blockedUser" element={<BlockedUser />} />
                    <Route path="/likedposts" element={<LikedPost />} />
                    <Route path="/commentedposts" element={<CommentedPost />} />
                    <Route
                      path="/chat/:id"
                      element={
                        <UserChat
                          socketConnected={socketConnected}
                          setSocketConnected={setSocketConnected}
                        />
                      }
                    />
                    <Route path="/anypost/:id" element={<AnyPost />} />
                  </Routes>
                </Content>
              </Layout>
            </Content>
          </Layout>
        </>
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
