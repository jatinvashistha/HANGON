const express = require('express');
const app = express();
const cors = require('cors')
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
const cookie = require('cookie-parser')
app.use(cookie())
app.use(
  cors({
    origin: process.env.FRONT_END,
    credentials: true,
  })
);
  
require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({extended  : true}))

const Post = require('./routes/post');
const User = require('./routes/user');
const Message = require('./routes/message');
const Chat  = require('./routes/chat')
const Notifications  = require('./routes/notifications')


app.use('/api/v1',Post);
app.use('/api/v1', User);
app.use('/api/v1',Chat)
app.use('/api/v1',Message)
app.use('/api/v1',Notifications)




module.exports = app
