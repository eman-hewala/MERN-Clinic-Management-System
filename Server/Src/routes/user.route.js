const express = require('express');
const router = express.Router();
const addUser = require('../controllers/user/addUser.controller');
const getUsers = require('../controllers/user/getAllUsers.controller');
const getUserById = require('../controllers/user/getUserById.controller');
const updateUser = require('../controllers/user/updateUser.controller');

router.post('/', addUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);

module.exports = router;