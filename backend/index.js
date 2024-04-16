const app = require('./backend/app');
const socket = require('socket.io')
const cors = require('cors');

const {connectDatabase }= require('./backend/config/database')
connectDatabase();
const http  = require('http');
const server =  http.createServer(app);
const io = socket(server, {
    cors: {
        origin:process.env.FRONT_END,
        credentials: true
    }
});


io.on("connection", (socket) => {
    
   
  socket.on("setup", (userData) => {
  
      socket.join(userData._id);
      
  });

  socket.on("notify", () => {
    socket.emit("notification");
  });

  socket.on("joinChat", (room) => {
    socket.join(room);
    socket.emit("chatJoined");
  
  });

  socket.on("leave", (room) => {
    socket.leave(room);
   
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("seenMessage", (room) => {
    console.log('hii')
    console.log(room.chat)
    socket.in(room?.chat).emit("seenMsg", room);
  });

    socket.on("newMessage", (newMessageReceived) => {

    var chat = newMessageReceived?.chat;

    if (!chat?.users) {
      return console.log("Chat not defined");
        }
        
        // chat.users.forEach((user) => {
        //     if (user._id == newMessageReceived.sender._id) return;
          
     socket.in(chat?._id).emit("messageReceived", newMessageReceived);
    // });
  });


        
        
        
        
        // io.to("65c601b80f1a0da17f821411").emit(
        //   "messageReceived",
        //   newMessageReceived
        // );
            // const roomSize = io.sockets.adapter.rooms;
            // console.log("pointone 3", roomSize);
        
    // });

 
  socket.on("disconnect", () => {
    console.log("User disconnected");
  
  });
});



server.listen(process.env.PORT ,() => {
    console.log(`Server is running on port ${process.env.PORT}`)
})