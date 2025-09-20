const express = require('express');
const router = express.Router();
const roomController = require('../../controllers/admin/roomController');

// แสดงรายการห้องทั้งหมด
router.get('/', roomController.listRooms);

// ฟอร์มเพิ่มห้อง
router.get('/add', roomController.addRoomForm);
router.post('/add', roomController.upload.single('image'), roomController.addRoom);

// ฟอร์มแก้ไขห้อง
router.get('/edit/:id', roomController.editRoomForm);
router.post('/edit/:id', roomController.upload.single('image'), roomController.updateRoom);

// ลบห้อง
router.get('/delete/:id', roomController.deleteRoom);

module.exports = router;
