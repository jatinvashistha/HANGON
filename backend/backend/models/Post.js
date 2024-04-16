const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  caption: String,
  imageUrl: {
    public_id: String,
    url: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes:
   [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Like"
    },
  ],
  comments: [
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }
  ],

  savedByUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User"
    }
  ],
  interestedByUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User"
    }
  ]

});
module.exports = mongoose.model("Post", postSchema);
