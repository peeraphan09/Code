const express = require('express');
const router = express.Router();
const payController = require('../../controllers/admin/payController');

// แสดงรายการบิล
router.get('/', payController.listPayments);

// เพิ่ม / แก้ไข / ลบ
router.get('/add', payController.addPaymentForm);
router.post('/add', payController.addPayment);
router.get('/edit/:id', payController.editPaymentForm);
router.post('/edit/:id', payController.updatePayment);
router.get('/delete/:id', payController.deletePayment);

// สร้าง PNG และส่งบิล
router.post('/send/:id', payController.sendToUser);

// ดูรูปบิล
router.get('/image/view/:id', payController.viewBillImage);

// ดาวน์โหลดรูปบิล
router.get('/image/download/:id', payController.downloadBillImage);

module.exports = router;