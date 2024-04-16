const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  item : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  repliesOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
  comment: {
    type: String,
    required: true,
  },
  notify: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  mention: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  reply: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Like",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Comment", commentSchema);
