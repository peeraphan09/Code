const express = require('express');
const router = express.Router();
const adminUserController = require('../../controllers/admin/user');

// หน้า list users
router.get('/', adminUserController.listUsers);

// หน้าแก้ไข user
router.get('/edit/:id', adminUserController.editUserForm);

// POST อัปเดต role
router.post('/update/:id', adminUserController.updateUserRole);

// ลบ user
router.get('/delete/:id', adminUserController.deleteUser);

module.exports = router;
