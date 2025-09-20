const express = require('express');
const router = express.Router();
const billController = require('../../controllers/admin/billController');

// แสดงรายการบิล
router.get('/', billController.listBills);

// ฟอร์มเพิ่มบิล
router.get('/add', billController.addBillForm);

// เพิ่มบิล
router.post('/add', billController.addBill);

// ลบบิล
router.get('/delete/:id', billController.deleteBill);

// แก้ไขบิล
router.get('/edit/:id', billController.editBillForm);
router.post('/edit/:id', billController.updateBill);

module.exports = router;
