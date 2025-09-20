const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const multer = require('multer');

// แสดงรายการอุปกรณ์ทั้งหมด
router.get('/equipmentList', (req, res) => {
    const message = req.query.message;
    const sql = 'SELECT * FROM equipment';
    req.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(sql, (err, results) => {
            if (err) throw err;
            res.render('users/equipmentList', { equipmentList: results, message });
        });
    });
});
// แสดงฟอร์มยืมแบบทั่วไป
router.get('/borrowRequestForm', (req, res) => {
    const message = req.query.message;
    res.render('users/borrowRequestForm', { message }); // render หน้า borrowRequestForm.ejs
});


// ยืมอุปกรณ์
// router.get('/borrowEquipment/:id', userController.borrowEquipment);

// router.post('/borrowEquipment/:id', (req, res) => {
//     const equipmentId = req.params.id;
//     const userId = req.session.user.id;  // สมมุติว่าผู้ใช้ล็อกอินแล้ว
//     const quantityRequested = req.body.quantity;

//     // เพิ่มคำขอยืมไปยังฐานข้อมูล
//     const query = 'INSERT INTO borrow_requests (equipment_id, user_id, quantity, status) VALUES (?, ?, ?, "Pending")';
    
//     req.getConnection((err, connection) => {  // ใช้ req.getConnection() ในการเชื่อมต่อฐานข้อมูล
//         if (err) throw err;
//         connection.query(query, [equipmentId, userId, quantityRequested], (err, result) => {
//             if (err) throw err;
//             // ส่ง message ไปยังหน้า equipmentList
//             res.redirect('/users/equipmentList?message=สำเร็จ%20รออนุมัติ');
//         });
//     });
// });


router.post('/borrowEquipment/:id', (req, res) => {
    const equipmentId = req.params.id;
    const userId = req.session.user?.id;
    const quantityRequested = req.body.quantity;
    const returnDate = req.body.return_date;

    if (!userId) return res.redirect('/login');

    const query = `
        INSERT INTO borrow_requests 
        (equipment_id, user_id, quantity, return_date, status) 
        VALUES (?, ?, ?, ?, "Pending")
    `;
    
    req.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(query, [equipmentId, userId, quantityRequested, returnDate], (err, result) => {
            if (err) throw err;
            res.redirect('/users/equipmentList?message=สำเร็จ%20รออนุมัติ');
        });
    });
});


module.exports = router;
