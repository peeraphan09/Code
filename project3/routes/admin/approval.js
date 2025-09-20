const express = require('express');
const router = express.Router();
const { approveEquipment, rejectEquipment } = require('../../controllers/adminController');

// อนุมัติอุปกรณ์
router.post('/approveEquipment/:id', approveEquipment);

// ปฏิเสธอุปกรณ์
router.post('/rejectEquipment/:id', rejectEquipment);

router.post('/confirmReturn/:id', (req, res) => {
    const requestId = req.params.id;

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        // 1. ดึงข้อมูลคำขอที่ต้องการยืนยันคืน
        const getRequestQuery = 'SELECT * FROM borrow_requests WHERE id = ?';

        connection.query(getRequestQuery, [requestId], (err, results) => {
            if (err) return res.status(500).send('ไม่พบคำขอคืน');
            if (results.length === 0) return res.status(404).send('ไม่พบคำขอคืน');

            const request = results[0];

            // 2. ย้ายข้อมูลไป borrow_history
            const insertHistoryQuery = `
                INSERT INTO borrow_history (user_id, equipment_id, date_borrowed, date_returned)
                VALUES (?, ?, ?, NOW())
            `;

            connection.query(insertHistoryQuery, [request.user_id, request.equipment_id, request.date_borrowed], (err) => {
                if (err) return res.status(500).send('ย้ายข้อมูลไปประวัติไม่สำเร็จ');

                // 3. ลบคำขอออกจาก borrow_requests
                const deleteRequestQuery = 'DELETE FROM borrow_requests WHERE id = ?';

                connection.query(deleteRequestQuery, [requestId], (err) => {
                    if (err) return res.status(500).send('ลบคำขอคืนไม่สำเร็จ');

                    // 4. เพิ่มจำนวนอุปกรณ์ (คืนอุปกรณ์)
                    const updateEquipmentQuery = `
                        UPDATE equipment SET quantity = quantity + 1, status = 'available' WHERE id = ?
                    `;

                    connection.query(updateEquipmentQuery, [request.equipment_id], (err) => {
                        if (err) return res.status(500).send('อัปเดตจำนวนอุปกรณ์ไม่สำเร็จ');

                        // เสร็จแล้ว
                        res.redirect('/admin/equipmentApproval');
                    });
                });
            });
        });
    });
});




module.exports = router;
