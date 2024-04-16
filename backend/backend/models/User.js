const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },
  avatar: {
    public_id: {
      type: String,
      default: "-1",
    },
    url: {
      type: String,
      default:
        "http://res.cloudinary.com/dk2scs5jz/image/upload/v1707475411/knlq1pczakdrogedjj2g.png",
    },
  },
  email: {
    type: String,
    required: [true, "Please enter a email"],
    unique: [true, "Email already exists"],
  },
  username: {
    type: String,
    required: [true, "Please enter username"],
    unique: [true, "Username already exists"],
    minlength: [4, "Username must be atleast 4 letter"],
  },
  bio: {
    type: String,
    default: " ",
  },
  blockedUser: [
  { user :  {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }}
  ],
  blockingYou: [
{   user :  {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },}
  ],

  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password must be atleast 6 character"],
    select: false,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  followers: [
  { user :  {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notify  : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
    }
  
  }
  ],

  following: [
 {  user :  {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }

  }
  ],
  savedPost: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  interestedPost: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  blueTick: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken : String,
  resetPasswordExpire : Date



});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex")
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  this.resetPasswordExpire = Date.now()+ 10*60*1000;

  return resetToken;





return resetToken;


}





userSchema.methods.matchPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this.id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model("User", userSchema);
