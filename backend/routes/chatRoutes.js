const express = require('express');
const router = express.Router();
const {
    askChatGPT,
    createChatIfNotExists,
    sendMessage,
} = require('../controllers/chatController');

router.post('/ask', askChatGPT);
router.post('/:chatId/send', sendMessage);
module.exports = router;
