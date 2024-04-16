


const Notifications = require("../models/Notification");

exports.allNotifications = async (req, res) => {
  try {
    const notifications = await Notifications.find({ receiver: req.user._id })
      .populate("sender")
      .populate("receiver");
    for (const notification of notifications) {
      await notification.populate("item")
      console.log(notification.item)
      if (notification.item && notification.item.post) {
        await notification.item.populate("post")
      }
      if (notification.item && notification.item.item) {
        await notification.item.populate("item")
      }
    }
    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.readNotifications = async (req, res) => {
  try {
    const notifications = await  Notifications.find({
      receiver: req.user._id,
    });
  

    notifications?.forEach(async (notification) => {
      notification.isRead = true;
      await notification.save();
    });
  
    return res.status(200).json({
      success: true,

      message: "notifications read successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
