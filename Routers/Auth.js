const express = require('express');
const auth = require('../Controllers/AuthController');

const router = express.Router();

router.post('/', auth.post_register);
router.put('/:id', auth.update_acc);
router.put('/:id/updateimg', auth.update_image);
router.put('/:id/addfriend', auth.add_friend);
router.put('/:id/deletefriend', auth.delete_friend);
router.get('/getusers', auth.get_users);
router.get('/:id/getuser', auth.get_user);
router.delete('/:id/delete', auth.post_delete);

module.exports = router;