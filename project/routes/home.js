const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// เส้นทางหน้าแรก
router.get('/', homeController.getHomePage);

module.exports = router;
