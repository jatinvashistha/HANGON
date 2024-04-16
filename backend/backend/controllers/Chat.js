const Chat = require("../models/Chat");
const User = require("../models/User");
const Message = require("../models/Message");
exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    }).populate("users");
    if (isChat.length > 0) {
      res.status(200).json({
        success: true,
        chat: isChat[0],
      });
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      res.status(200).json({
        success: true,
        chat: createdChat,
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.fetchChat = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users")
      .populate({
        path: "latestMessage",
        populate: {
          path: "seenBy.user",
          model: "User",
        },
      })
      .populate("groupAdmin")
      .sort({
        updatedAt: -1,
      });
    
    const newChats = [];
    chats.forEach((chat) => {
      if (chat.isGroupChat) {
        newChats.push(chat);
      } else {
        if (!chat.isGroupChat && chat?.latestMessage) {
        

          if (chat?.deleteChat?.length>0) {
            console.log("chat deleted");
            chat.deleteChat.forEach((item) => {
              if (item.user.toString() === req.user._id.toString()) {
                const created = new Date(item.timeStamps);
                const chatTime = new Date(chat?.latestMessage?.createdAt);
                if (created < chatTime) {
                  console.log("hell");
                  newChats.push(chat);
                }
              } else {
                newChats.push(chat);
              }
            });
          } else {
          
            newChats.push(chat );
          }
        }
       
      }
    });

    const filterItems =newChats.filter((item) => {if(item.isGroupChat|| item.latestMessage ) return item})

    res.status(200).json({
      success: true,
      chats: newChats,
    });
  } catch (e) {
    success: false;
  }
};
exports.fetchSingleChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.body.chatId)
      .populate("users")
      .populate({
        path: "latestMessage",
        populate: {
          path: "seenBy.user",
          model: "User",
        },
      })
      .populate("groupAdmin")
      .sort({
        updatedAt: -1,
      });

    res.status(200).json({
      success: true,
      chat,
    });
  } catch (e) {
    success: false;
  }
};

exports.groupChat = async (req, res) => {
  try {
    if (!req.body.users && !req.body.name) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the field",
      });
    }
    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Users must be more than two",
      });
    }
    users.push(req.user);
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.find({
      _id: groupChat._id,
    })
      .populate("users")
      .populate("groupAdmin");
    res.status(200).json({
      success: true,
      chat: fullGroupChat,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.updatedName = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    );
    if (!updatedChat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    } else {
      return res.status(200).json({
        message: "Name updated Successfully",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.addToGroupChat = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (chat) {
      if (chat?.groupAdmin.toString() == req.user?._id.toString()) {
        const remove = await Chat.findByIdAndUpdate(
          chatId,
          {
            $push: { users: userId },
          },
          {
            new: true,
          }
        );
        if (remove) {
          return res.status(200).json({
            success: true,
            message: "Successfully Added",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "Only admin can add",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Chat not found",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.removeToGroupChat = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (chat) {
      if (chat?.groupAdmin.toString() === req.user?._id.toString()) {
        const remove = await Chat.findByIdAndUpdate(
          chatId,
          {
            $pull: { users: userId },
          },
          {
            new: true,
          }
        );
        return res.status(200).json({
          success: true,
          message: "Successfully Removed",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Only admin can remove",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Chat not found",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.body;
    
    const chat = await Chat.findByIdAndDelete(chatId, {
      new: true,
    });
    if (!chat?.users?.includes(req?.user?._id)) {
      return res.status(400).json({
        success: false,
        message: "User is not in the chat.",
      });
    }
    const index = chat?.users?.indexOf(req.user?._id);
    chat?.users?.splice(index, 1);

    await chat.save();
    res.status(200).json({
      success: true,
      message: "Chat Deleted",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.deleteUserChat = async (req, res) => {
  try {
    const { chatId } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(400).json({
        success: false,
        message: "Chat not found",
      });
    }

    const index = chat.deleteChat.findIndex(
      (item) => item.user.toString() == req.user._id.toString()
    );
    if (index !== -1) {
      chat.deleteChat[index].timeStamps = Date.now();
      await chat.save();
      return res.status(200).json({
        success: true,
        message: "Chat deleted successfully",
      });
    } else {
      const deletedUserChat = {
        user: req.user._id,
        timeStamps: Date.now(),
      };

      chat.deleteChat.push(deletedUserChat);
      await chat.save();

      return res.status(200).json({
        success: true,
        message: "Chat deleted successfully",
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
