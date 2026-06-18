const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller'); // 👈 Controller එක ලින්ක් කරා

// http://localhost:5000/api/auth/register
router.post('/register', authController.register);

// http://localhost:5000/api/auth/login
router.post('/login', authController.login);

module.exports = router;