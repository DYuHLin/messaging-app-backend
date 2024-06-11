const express = require('express');
const chat = require('../Controllers/ChatController');

const router = express.Router();

router.get('/:id', chat.get_chats);
router.post('/', chat.post_chat);
router.delete('/:id', chat.delete_chat);

module.exports = router;