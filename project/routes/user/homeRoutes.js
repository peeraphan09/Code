// routes/user/homeRoutes.js
const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/user/homeController'); // ตรงกับไฟล์จริง

router.get('/', homeController.homeUS); // ใช้ '/' เพราะเราจะ mount ที่ app.js

module.exports = router;
