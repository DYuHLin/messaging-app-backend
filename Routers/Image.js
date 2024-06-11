const express = require('express');
const image = require('../Controllers/AuthController');

const router = express.Router();

router.post('/', image.profile_image);

module.exports = router;