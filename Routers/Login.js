const express = require('express');
const login = require('../Controllers/LoginController');

const router = express.Router();

router.post('/', login.post_login);
router.post('/logout', login.post_logout);
router.delete('/delete', login.post_delete);

module.exports = router;