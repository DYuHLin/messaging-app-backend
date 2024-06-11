const express = require('express');
const message = require('../Controllers/MessageController');

const router = express.Router();

router.post('/', message.post_message);
router.get('/:id', message.get_messages);
router.delete('/:id/delete', message.delete_message);

module.exports = router;