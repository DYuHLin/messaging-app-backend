const express = require('express');
const group = require('../Controllers/GroupController');

const router = express.Router();

router.post('/', group.create_group);
router.get('/:id', group.group_detail);
router.get('/:id/getgroups', group.fetch_groups);
router.put('/:id/add', group.add_members);
router.put('/:id/delete', group.delete_group);
router.delete('/:id/deletegroup', group.delete_group_admin);

module.exports = router;