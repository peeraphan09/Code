const express = require('express');
const router = express.Router();
const billController = require('../../controllers/user/billController');

// แสดงบิลทั้งหมดที่ user สามารถเห็นได้
router.get('/', billController.listUserBills);

// ดูรูป PNG บิล
router.get('/image/view/:id', billController.viewBillImage);

// ดาวน์โหลด PNG บิล
router.get('/image/download/:id', billController.downloadBillImage);

module.exports = router;
