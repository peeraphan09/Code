const express = require('express');
const router = express.Router();

// --- หน้าให้ผู้ใช้ยืมอุปกรณ์ --- 
// ใช้ route เดียวกันสำหรับผู้ใช้และ admin
router.get('/borrowEquipment/:id', (req, res) => {  
    const equipmentId = req.params.id;
    const sql = 'SELECT * FROM equipment WHERE id = ?';

    req.getConnection((err, connection) => {  // ใช้ req.getConnection() แทน db.query()
        if (err) throw err;

        connection.query(sql, [equipmentId], (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                if (req.session.user && req.session.user.isAdmin) {
                    // สำหรับ admin แสดงหน้ารายการคำขอยืม
                    res.render('admin/borrowRequests', { equipment: results[0] });
                } else {
                    // สำหรับผู้ใช้ทั่วไป แสดงฟอร์มยืมอุปกรณ์
                    res.render('users/borrowEquipment', { equipment: results[0] });
                }
            } else {
                res.send('ไม่พบอุปกรณ์');
            }
        });
    });
});

// --- รับข้อมูลจากฟอร์มยืม ---
// ฟังก์ชันนี้สำหรับผู้ใช้ทั่วไปในการยืมอุปกรณ์
router.post('/borrowEquipment/:id', (req, res) => {
    const equipmentId = req.params.id;
    const userId = req.session.user.id; // สมมุติว่า login แล้วเก็บไว้
    const quantity = req.body.quantity;

    // ตรวจสอบว่าผู้ใช้ล็อกอินหรือยัง
    if (!userId) {
        return res.redirect('/login'); // ถ้าไม่ล็อกอินให้ไปหน้า login
    }

    const sql = 'INSERT INTO borrow_requests (user_id, equipment_id, quantity, status) VALUES (?, ?, ?, "pending")';
    req.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(sql, [userId, equipmentId, quantity], (err, result) => {
            if (err) throw err;
            // หลังจากยืมอุปกรณ์สำเร็จให้ไปที่หน้า equipmentList
            res.redirect('/users/equipmentList?message=ยืมอุปกรณ์สำเร็จ');
        });
    });
});

// --- หน้าสำหรับ admin ดูคำขอที่ยังรออนุมัติ ---
// ใช้ route เดียวกันเพื่อให้ admin ดูคำขอที่รออนุมัติ
router.get('/admin/borrow-requests', (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.redirect('/login');
    }

    req.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`SELECT * FROM borrow_requests WHERE status = 'pending'`, (err, requests) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการโหลดข้อมูล');
            res.render('admin/borrowRequests', { requests });
        });
    });
});

// --- อัปเดตสถานะ (อนุมัติ / ปฏิเสธ) ---
// ใช้ route เดียวกันเพื่ออัปเดตสถานะคำขอจาก admin
router.post('/admin/borrow-requests/:id', (req, res) => {
    const requestId = req.params.id;
    const status = req.body.status;

    req.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`UPDATE borrow_requests SET status = ? WHERE id = ?`, [status, requestId], (err) => {
            if (err) return res.send('ไม่สามารถอัปเดตสถานะได้');
            res.redirect('/admin/borrow-requests');
        });
    });
});

module.exports = router;
