// ยืมอุปกรณ์
exports.borrowEquipment = (req, res) => {
    const equipmentId = req.params.id;
    const userId = req.session.user.id; // สมมติว่ามี user session

    req.getConnection((err, connection) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
        
        // แก้ไขสถานะอุปกรณ์เป็นไม่พร้อมใช้งาน
        const query = 'UPDATE equipment SET status = "unavailable" WHERE id = ?';
        connection.query(query, [equipmentId], (err, result) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการยืมอุปกรณ์');
            
            // บันทึกคำขอยืม
            const insertQuery = 'INSERT INTO borrow_requests (user_id, equipment_id, status) VALUES (?, ?, "pending")';
            connection.query(insertQuery, [userId, equipmentId], (err, result) => {
                if (err) return res.send('เกิดข้อผิดพลาดในการบันทึกคำขอยืม');
                res.redirect('/user/equipmentList');  // ไปที่หน้ารายการอุปกรณ์ของ user
            });
        });
    });
};

// อนุมัติการยืม
exports.approveRequest = (req, res) => {
    const requestId = req.params.id;

    req.getConnection((err, connection) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
        
        const query = 'UPDATE borrow_requests SET status = "approved" WHERE id = ?';
        connection.query(query, [requestId], (err, result) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการอนุมัติคำขอ');
            
            res.redirect('/admin/equipmentApproval');  // ไปที่หน้าอนุมัติการยืม
        });
    });
};

// ปฏิเสธการยืม
exports.rejectRequest = (req, res) => {
    const requestId = req.params.id;

    req.getConnection((err, connection) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
        
        const query = 'UPDATE borrow_requests SET status = "rejected" WHERE id = ?';
        connection.query(query, [requestId], (err, result) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการปฏิเสธคำขอ');
            
            res.redirect('/admin/equipmentApproval');  // ไปที่หน้าอนุมัติการยืม
        });
    });
};
