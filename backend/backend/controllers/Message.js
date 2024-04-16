const Message = require("../models/Message");
const Chat = require("../models/Chat");
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({
        success: false,
        message: "Chatid and content is not present",
      });
    }
    var newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
      seenBy: [
     {  
      user: req.user?._id,
      timestamp: new Date(),
      }],
    };
    
    var message = await Message.create(newMessage);
  
    var chat = await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    const msg = await Message.findById(message._id).populate("sender chat");

    return res.status(200).json({
      success: true,
      message: msg,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
exports.allMessages = async (req, res) => {
  try {
    const chatId = req?.params?.id;
    const chat = await Chat.findById(chatId).populate("deleteChat");
    
    let createdAt = null;
    if (chat.deleteChat) {
      chat.deleteChat.forEach((item) => {
        if (item.user.toString() === req.user._id.toString()) {
          createdAt = item.timeStamps; 
        }
      });
    }

    let query = { chat: chatId };
    if (createdAt) {
      query.createdAt = { $gte: new Date(createdAt) };
    }

    const chats = await Message.find(query)
      .populate("chat")
      .populate("sender");

    return res.status(200).json({
      success: true,
      chats,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.seenMessage = async (req, res) => {
    try {
      const { chatId } = req.body;
      const userId = req.user._id
      
  
      const chat = await Chat.findById(chatId).populate("latestMessage");
   
  
      if (!chat) {
        return res.status(400).json({
          success: false,
          message: "Chat not found",
        });
      }

  
      const { users, latestMessage } = chat;
      if(!latestMessage) {
        return res.status(500).json({
            success : true,
            message : "No latest message"
        })
      }
      if (users && users.includes(userId)) {
        const { seenBy } = latestMessage || {};

        const obj = seenBy?.find((user) => user?.user?._id.toString() === userId.toString());

        
        if (obj) {
          return res.status(200).json({
            success: true,
            message: "Already Seen",
          });
        }
        const message =await Message.findById(latestMessage._id);

  
        const seenby = {
            user: req.user?._id,
          timestamp: new Date(),
        };

        message.seenBy.push(seenby);
        await message.save();
        await chat.save();
  
        return res.status(200).json({
          success: true,
          message: "Message seen successfully",
        });
      }
  
      return res.status(400).json({
        success: false,
        message: "User is not in chat",
      });
  
     
    } catch (e) {
      res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  };
  
