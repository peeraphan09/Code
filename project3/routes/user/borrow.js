const express = require('express');
const router = express.Router();

// แสดงฟอร์มยืม
router.get('/borrowEquipment/:id', (req, res) => {  
    const equipmentId = req.params.id;
    const sql = 'SELECT * FROM equipment WHERE id = ?';
    req.getConnection((err, connection) => {  // ใช้ req.getConnection() แทน db.query()
        if (err) throw err;
        connection.query(sql, [equipmentId], (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                res.render('users/borrowEquipment', { equipment: results[0] });
            } else {
                res.send('ไม่พบอุปกรณ์');
            }
        });
    });
});


router.post('/user/borrow', (req, res) => {
    const itemName = req.body.item;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.redirect('/login');
    }

    // คำสั่ง SQL จำลอง ใส่ตามโครงสร้างตารางจริงของคุณ
    const query = 'INSERT INTO borrow_requests (user_id, equipment_name, quantity, status) VALUES (?, ?, ?, "Pending")';
    req.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(query, [userId, itemName, 1], (err, result) => {
            if (err) throw err;
            res.redirect('/users/equipmentList?message=ยืมสำเร็จ รออนุมัติ');
        });
    });
});




module.exports = router;

router.get('/someRoute', (req, res) => {
    res.send('Some response');
});
module.exports = router;
