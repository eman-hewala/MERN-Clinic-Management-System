const express = require('express');
const router = express.Router();
const addUser = require('../controllers/user/addUser.controller');
const updateUser = require('../controllers/user/updateUser.controller');

router.post('/', addUser);
router.patch('/:id', updateUser);

module.exports = router;