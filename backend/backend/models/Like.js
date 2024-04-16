const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "Post"  
  },


  notify: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notification",
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "itemType",
  },
  itemType: {
    type: String,
    enum: ["Post", "Comment"],
  },
});

module.exports = mongoose.model("Like", likeSchema);