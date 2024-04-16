const User = require("../models/User");
const Post = require("../models/Post");
const Notifications = require("../models/Notification");
const Notification = require("../models/Notification");
const { sendEmail } = require("../middlewares/sendEmail");
const crypto = require('crypto')

exports.register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
  
    let user = await User.findOne({ email });
    console.log(user)
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    let usern = await User.findOne({ username });
    if (usern) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }
    user = await User.create({
      name,
      email,
      password,
      username,
    });

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
       secure:true, 
        sameSite:"none",

    };

    res
      .status(201)
      .cookie("token", token, options)
      .json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
        },
        token,
      });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
     return res.status(400).json({
        success: false,
        message: "Username or password is wrong",
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(email, password);
      return res.status(400).json({
        success: false,
        message: "password don't match",
      });
    }

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
     secure:true, 
        sameSite:"none",

    };

    res.status(201).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Logged Out",
      });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.userFollowAndUnfollow = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id).populate("following followers");
    const userLoggedIn = await User.findById(req.user._id).populate("following followers")
    if (!userToFollow) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }
    let index1 = -1;
    
    const follow = userLoggedIn.following.find((use,key) => { if(use.user.toString() === userToFollow._id.toString() ) {
      index1  = key;
      return use.user
    }  })
    if (follow) {
      var index2;
      const follow2 = userToFollow.followers.find((use,key) => { if(use.user.toString() === userLoggedIn._id.toString() ) {
        index2  = key;
        return use
      }  })
      await Notification.findByIdAndDelete(follow2.notify)
      userLoggedIn.following.splice(index1, 1);
      userToFollow.followers.splice(index2, 1);
      await userLoggedIn.save();
      await userToFollow.save();
      return res.status(200).json({
        success: true,
        message: "User unfollowed ",
      });
    } else {
      const notification = await Notification.create({
        message: "Started following you",
        receiver: [userToFollow._id],
        sender: userLoggedIn._id,
        item : userToFollow._id,
        itemModel : "User"
      })
     
      userLoggedIn.following.push(
      {   user : userToFollow._id
      }
        );
      userToFollow.followers.push({
      user :   userLoggedIn._id,
      notify : notification._id
    });
      await userLoggedIn.save();
      await userToFollow.save();
      return res.status(200).json({
        success: true,
        message: "User followed",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide old and new Password",
      });
    }

    const match = await user.matchPassword(oldPassword);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Wrong old password",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password Updated successfully",
    });
  } catch (e) {
    res.status(500).status({
      success: false,
      message: e.message,
    });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const { email, name, username, avatar, bio } = req.body;
    console.log(email, name, username, bio);
    const user = await User.findById(req.user._id);

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (username) {
      user.username = username;
    }
    if (bio) {
      user.bio = bio;
    }
    if (avatar) {
      user.avatar = avatar;
    }
    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.deleteMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const posts = user.posts;
    const followers = user.followers;
    const following = user.following;
    const userId = req.user._id;
    await User.findByIdAndDelete(req.user._id);
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    for (let i = 0; i < posts.length; i++) {
      await Post.findByIdAndDelete(posts[i]);
    }
    for (let i = 0; i < followers.length; i++) {
      const follower = await User.findById(followers[i]);
      const index = follower.following.indexOf(userId);
      follower.following.splice(index, 1);
      await follower.save();
    }

    for (let i = 0; i < following.length; i++) {
      const follows = await User.findById(following[i]);
      const index = follows.followers.indexOf(userId);
      follows.followers.splice(index, 1);
      await follows.save();
    }

    res.status(200).json({
      success: true,
      message: "Profile Deleted",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "followers",
        populate: {
          path: "user",
          model  : "User",
        },
      })
      .populate({
        path: "following",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .populate({
        path: "blockedUser blockingYou",
        populate : {
          path : "user"
        }
        
      })
      .populate({
        path: "posts",
        populate: {
          path: "likes comments owner",
          model: "User",
        },
      })
      .populate({
        path: "savedPost",
        populate: {
          path: "likes comments owner",
          model: "User",
        },
      })
      .populate({
        path: "interestedPost",
        populate: {
          path: "likes comments owner",
          model: "User",
        },
      })

    res.status(200).json({
      success: true,
      user,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    .populate({
      path: "followers",
      populate: {
        path: "user",
        model  : "User",
      },
    })
    .populate({
      path: "following",
      populate: {
        path: "user",
        model: "User",
      },
    })
    .populate({
      path: "blockedUser blockingYou",
      
    })
    .populate({
      path: "posts",
      populate: {
        path: "likes comments owner",
        model: "User",
      },
    })
    .populate({
      path: "savedPost",
      populate: {
        path: "likes comments owner",
        model: "User",
      },
    })
    .populate({
      path: "interestedPost",
      populate: {
        path: "likes comments owner",
        model: "User",
      },
    })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (e) {
    res.status(500).json({
      success: true,
      message: e.message,
    });
  }
};
exports.getAllUsers = async (req, res) => {
  
  try {
    const users = await User.find({
      _id: { $nin :[ req?.user?._id,
        ...req?.user?.blockedUser.map((item ) => item.user) ,
        ...req?.user?.blockingYou.map((item ) => item.user) ,
        ...req?.user?.following.map((item ) => item.user) ,
      ]    },
    });


    res.status(200).json({
      success: true,
      users,
    });
  } catch (e) {
    res.status(500).json({
      success: true,
      message: e.message,
    });
  }
};
exports.allUsers = async (req, res) => {
  
  try {
    const users = await User.find({
      _id: { $nin :[ req?.user?._id,
        ...req?.user?.blockedUser.map((item ) => item.user) ,
        ...req?.user?.blockingYou.map((item ) => item.user) ,
      ]    },
    });


    res.status(200).json({
      success: true,
      users,
    });
  } catch (e) {
    res.status(500).json({
      success: true,
      message: e.message,
    });
  }
};
exports.notifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user && user.notifications) {
      user.notifications.forEach((notification) => {
        notification.isRead = true;
      });
    }
    await user.save();
    res.status(200).json({
      success: true,
      msg: "Notifications updated successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: true,
      message: e.message,
    });
  }
};
exports.allUser = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { username: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find({
      ...keyword,
      _id: { $nin :[ req?.user?._id,
        ...req?.user?.blockedUser.map((item ) => item.user) ,
        ...req?.user?.blockingYou.map((item ) => item.user) ,
      ]    },
    });
    res.status(200).json({
      success: true,
      users: users,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
exports.blockUser = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findById(req.user?._id);
    const userToBlock = await User.findById(userId);
    if (!userToBlock) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    var blockedIndex = -1;
    const blockedAlready = user?.blockedUser.find((item ,key ) => {
      if(item?.user?.toString() == userToBlock?._id?.toString()) {
        blockIndex = key
        return item?.user
      }
    })

    // console.log('hey', blockedIndex);
   
    if(blockedAlready) {
      var blockingIndex =-1;
      const blockingAlready = userToBlock.blockingYou.find((item,key) => { 
        if(item?.user == user._id) {
          blockIndex =  key
          return item.user
        }
      })
      user.blockedUser.splice(blockedIndex, 1);
      userToBlock.blockingYou.splice(blockingIndex,1);
      await userToBlock.save();
      await user.save();
      return res.status(200).json({
        success: true,
        message: "User unblocked",
      });
    }
    else {
      let userFollowingIndex =-1;
      let userFollowerIndex = -1;
      let userToBlockFollowing = -1;
      let userToBlockFollower  =-1;

      
    const a =    user?.following.find((item,key ) => {
        if(item?.user?.toString() == userToBlock?._id?.toString()) {
          userFollowingIndex = key
          return item?.user
        }
      })
  
   
    const b =    user?.followers.find((item ,key) => {
        if(item?.user?.toString() == userToBlock?._id?.toString()) {
          userFollowerIndex = key
          return item?.user
        }
      })
  
    const c = userToBlock?.following.find((item,key ) => {
        if(item?.user?.toString() == user?._id?.toString()) {
          userToBlockFollowing = key
          return item?.user
        }
      })
      
   const d = userToBlock?.followers.find((item ,key) => {
        if(item?.user?.toString() == user?._id?.toString()) {
          userToBlockFollower = key
          return item?.user
        }
      })
      console.log('hey', blockedIndex);
      if(a) {
        user.following.splice(userFollowingIndex,1);
      }
      if(b) {
        user.followers.splice(userFollowerIndex,1);
      }
      if(c) {
        userToBlock.following.splice(userToBlockFollowing,1);
      }
      if(d) {
        userToBlock.followers.splice(userToBlockFollower,1);
      }
    const newBlock = {
      user : userToBlock._id
    }
    const newBlocking = {
      user : req.user._id
    }
    userToBlock.blockingYou.push(newBlocking);
    user.blockedUser.push(newBlock);
    await userToBlock.save();
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: "User blocked successfully",
    });

    }


   
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};



exports.forgotPassword = async (req,res) =>{
  try {
    console.log(req.body.email)
    const user = await User.findOne({
      email : req.body.email
    })

  
   
    if(!user){
      return res.status(404).json({
        success : false,
        message : "User not found"
      })

    }
    const resetPasswordToken =  user.getResetPasswordToken();

  
    await user.save();

    const reseturl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetPasswordToken}`;
    const message = `Reset your password by clicking on the link below: \n\n ${reseturl}`;

    try {
      await sendEmail({
        email : user.email, subject : "Reset password" , message
      })
      res.status(200).json({
        success : true,
        message : `Email sent to ${user.email}`
      })


    }
catch(e){
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return res.status(500).json({
    success : false,
    message : e.message
  })
  

}





  }catch(e){
    res.status(500).json({
      success : false,
      message : e.message
    })

  }
}
exports.resetPassword = async(req,res) =>{
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire  : {$gt :  Date.now()}
    })
    if(!user){
      return  res.status(401).json({
        success : false,
        message : "Token is invalid or had expired"
      })
       
    }
    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken =  undefined;
    await user.save();

return res.status(200).json({
  success : true,
  message : "Password updated"

})
    

  }catch(e){
    res.status(500).json({
      success: false,
      message: e.message,
    });

  }
}
exports.checkemail = async (req, res) => {
  try {
    const email = req.body.email;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email is correct"
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    });
  }
};

exports.checkusername  = async (req,res) =>{
  try {
    const username = req.body.username;
    console.log(username)
    const existingUser = await User.findOne({ username });


    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username  already exists"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Username not exist"
    });

  }catch(e){
    return res.status(500).json({
      success: false,
      message: e.message,

    })
  }

}
exports.removeFollower = async (req, res) => {
  try {
  
    const userToRemove = await User.findById(req.body.userId).populate("following followers")
    console.log(userToRemove._id)
    if (!userToRemove) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      }
      )
    }
      const userLoggedIn = await User.findById(req.user._id).populate('following followers')
      let index1 = -1;


      const follow = userLoggedIn.followers.find((use, key) => {
        if (use.user.toString() === userToRemove._id.toString()) {
          index1 = key    
          return use
        }
      })

      if (!follow) {
        return res.status(400).json({
          success : false,
          message : "User not found in follower list"
        })
      }
      let index2 = -1;
        const follow2  = userToRemove.following.find((use, key) => {
          if (use.user.toString() === userLoggedIn._id.toString()) {
            index2 = key
            return use.user  
        }
      })
      
      await Notification.findByIdAndDelete(follow.notify);
      userLoggedIn.followers.splice(index1, 1);
      userToRemove.following.splice(index2, 1);
      await userLoggedIn.save();
      await userToRemove.save();

      return res.status(200).json({
        success: true,
        message : "Follower to remove successfully"
      })
      
    

  } catch (e) {
    res.status(500).json({
      
    })
  }
}
