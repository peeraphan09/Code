const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// เส้นทางแสดงข้อมูลผู้ใช้ทั้งหมด
router.get('/manageRoles', userController.getAllUsers);

// เส้นทางอัปเดต Role ของผู้ใช้
router.post('/updateRole', userController.updateRole);

// เส้นทางเพิ่มผู้ใช้
router.post('/createUser', userController.createUser);

// เส้นทางลบผู้ใช้
router.delete('/deleteUser/:userId', userController.deleteUser);

// เส้นทางตรวจสอบข้อมูลผู้ใช้
router.get('/userInfo/:userId', userController.getUserInfo);

module.exports = router;
