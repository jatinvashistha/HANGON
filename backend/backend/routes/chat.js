const express= require('express');
const { isAuthenticated } = require('../middlewares/auth');
const { accessChat, fetchChat, groupChat, updatedName, addToGroupChat, removeToGroupChat, deleteChat, deleteUserChat, fetchSingleChat,  } = require('../controllers/Chat');
const router = express.Router();

router.route('/chat/').post(isAuthenticated,accessChat)
router.route('/chats').get(isAuthenticated,fetchChat);
router.route('/group').post(isAuthenticated,groupChat);
router.route('/renamegroup').put(isAuthenticated,updatedName)
router.route('/addtogroup').put(isAuthenticated,addToGroupChat)
router.route('/removefromgroup').put(isAuthenticated,removeToGroupChat)
router.route('/deletechat').put(isAuthenticated,deleteChat)
router.route('/deleteuserchat').put(isAuthenticated,deleteUserChat)
router.route('/singlechat').put(isAuthenticated,fetchSingleChat)

module.exports = router;
