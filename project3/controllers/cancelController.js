exports.cancelBorrowRequest = (req, res, requestId, userId) => {
    const query = `UPDATE borrow_requests SET status = 'canceled' WHERE id = ? AND user_id = ?`;

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        connection.query(query, [requestId, userId], (err, result) => {
            if (err) return res.status(500).send('เกิดข้อผิดพลาดในการยกเลิกคำขอยืม');
            
            res.redirect('/user/orderList');  // หลังจากยกเลิกคำขอยืม ให้กลับไปที่หน้ารายการคำขอยืม
        });
    });
};
// เส้นทางการแสดงรายการคำขอยืม
