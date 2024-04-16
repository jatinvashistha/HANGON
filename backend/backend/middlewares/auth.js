const User = require("../models/User");

const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;  

  if (!token) {
    return res.status(400).json({
      message: "Please login first",
    });
  }
  const id = await jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findOne({ _id: id });
    
  next();
};


