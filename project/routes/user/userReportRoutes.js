const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/user/reportController');

// หน้าแสดงรายงานทั้งหมดของ user
router.get('/', reportController.listReports);

// หน้าเพิ่มเรื่อง
router.get('/add', reportController.addReportView);

// ส่งเรื่องใหม่
router.post('/add', reportController.addReport);

module.exports = router;
