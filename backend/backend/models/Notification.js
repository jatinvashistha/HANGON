const mongoose = require('mongoose');
const notificationsSchema = new mongoose.Schema({
    message : String,
    item : {
        type : mongoose.Schema.Types.ObjectId,
        refPath : "itemModel"
    },
    itemModel : {
        type : String,
        enum :['Like','User','Comment']
    },
    timestamp : {
        type : Date,default : Date.now
    }
    ,
    isRead : {
        type : Boolean,default : false
    }
    ,
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
    ,
    receiver : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }]
})
module.exports = mongoose.model("Notification",notificationsSchema)