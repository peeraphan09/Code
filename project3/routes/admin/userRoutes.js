const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user');  // นำเข้า Controller

// ตรวจสอบว่าเป็นแอดมินหรือไม่
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    return res.redirect('/login');  // ถ้าไม่ใช่แอดมินให้ไปที่หน้า login
};

// เส้นทางต่างๆ สำหรับแอดมิน
router.get('/admin/user', isAdmin, userController.getAllUsers);  // ดูรายการผู้ใช้
router.get('/admin/user/create', isAdmin, (req, res) => res.render('admin/createUser'));  // ฟอร์มเพิ่มผู้ใช้
router.post('/admin/user/create', isAdmin, userController.createUser);  // เพิ่มผู้ใช้
router.get('/admin/user/edit/:id', isAdmin, userController.editUser);  // ฟอร์มแก้ไขผู้ใช้
router.post('/admin/user/edit/:id', isAdmin, userController.updateUser);  // อัพเดทผู้ใช้
router.get('/admin/user/delete/:id', isAdmin, userController.deleteUser);  // ลบผู้ใช้

module.exports = router;
