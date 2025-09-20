
const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');
const multer = require('multer');
const path = require('path');

// ตั้งค่าการอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Middleware ตรวจสอบสิทธิ์ Admin
function isAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.send('คุณยังไม่ได้เข้าสู่ระบบหรือไม่มีสิทธิ์');
  }
  next();
}

// เพิ่มอุปกรณ์ใหม่
router.post('/addEquipment', upload.single('image'), adminController.addEquipment);

// แสดงรายการอุปกรณ์
router.get('/equipmentList', isAdmin, adminController.getEquipmentList);

// ฟอร์มเพิ่มอุปกรณ์ใหม่
router.get('/addEquipment', isAdmin, adminController.getAddEquipment);

// แก้ไขอุปกรณ์
router.get('/editEquipment/:id', isAdmin, adminController.editEquipment);

// อัพเดตอุปกรณ์
// router.post('/editEquipment/:id', isAdmin, adminController.updateEquipment);

router.post('/editEquipment/:id', isAdmin, upload.single('image'), adminController.updateEquipment);

// ลบอุปกรณ์
router.post('/deleteEquipment/:id', isAdmin, adminController.deleteEquipment);

router.get('/deleteEquipment/:id', isAdmin, adminController.deleteEquipment);

router.get('/history', adminController.viewHistory);

module.exports = router;
