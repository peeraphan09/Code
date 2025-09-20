const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // path ต้องถูกต้อง

// หน้า Login
router.get('/login', authController.getLogin);

// POST Login
router.post('/login', authController.postLogin);

// หน้า Register
router.get('/register', authController.getRegister);

// POST Register
router.post('/register', authController.postRegister);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
