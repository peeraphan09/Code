const express = require('express');
const router = express.Router();

const device = require('../controllers/device'); // แก้ DeviceController เป็น device

router.get('/', device.list); // แก้ DeviceController เป็น device

router.get('/add', device.add); // แก้ DeviceController เป็น device
router.post('/add', device.save); // แก้ DeviceController.new เป็น device.save

router.get('/edit/:id', device.edit); // แก้ DeviceController เป็น device
router.post('/edit/:id', device.update); // แก้ DeviceController เป็น device

router.get('/delete/:id', device.delete);  // แก้ DeviceController เป็น device
router.post('/delete/:id', device.delete1); // แก้ DeviceController เป็น device

module.exports = router;
