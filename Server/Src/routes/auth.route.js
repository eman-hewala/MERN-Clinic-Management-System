const express = require('express');
const router = express.Router();

const login = require('../controllers/auth/login.controller');
const logout = require('../controllers/auth/logout.controller');

router.post('/login', login);
router.post('/logout', logout);

module.exports = router;