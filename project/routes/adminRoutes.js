const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// หน้า Home Admin (เฉพาะ admin)
router.get('/homeList', adminController.homeList);
// router.get("/dashboard", adminController.getDashboard);
module.exports = router;
