const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const { sendMessage, allMessages, seenMessage } = require('../controllers/Message');
const router = express.Router();

router.route('/sendmessage').post(isAuthenticated,sendMessage);
router.route('/allmessage/:id').get(isAuthenticated,allMessages);
router.route('/seenmessage').put(isAuthenticated,seenMessage)



module.exports = router;