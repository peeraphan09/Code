const mysql = require('mysql');

// แสดงรายการอุปกรณ์ทั้งหมด
exports.getEquipmentList = (req, res) => {
    req.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        res.send('Error connecting to the database');
      } else {
        connection.query('SELECT * FROM equipment', (err, results) => {
          if (err) {
            console.log(err);
            res.send('Error fetching equipment');
          } else {
            res.render('users/equipmentList', { equipment: results });
          }
        });
      }
    });
};

// แสดงฟอร์มยืมอุปกรณ์
exports.showBorrowForm = (req, res) => {
    const equipmentId = req.params.id;
    const query = 'SELECT * FROM equipment WHERE id = ?';

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
        connection.query(query, [equipmentId], (err, results) => {
            if (err) return res.status(500).send('เกิดข้อผิดพลาด');
            if (results.length === 0) return res.status(404).send('ไม่พบอุปกรณ์');

            res.render('users/borrowEquipment', { equipment: results[0] });
        });
    });
};

// รับข้อมูลจากฟอร์มยืมอุปกรณ์
// exports.borrowEquipment = (req, res) => {
//     const userId = req.session.userId; // ตรวจสอบว่า session userId มีอยู่
//     const equipmentId = req.params.id;
//     const quantity = parseInt(req.body.quantity);

//     // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
//     if (!userId) return res.redirect('/login');

//     const query = `
//         INSERT INTO borrow_requests (user_id, equipment_id, quantity, status)
//         VALUES (?, ?, ?, 'pending')
//     `;

//     req.getConnection((err, connection) => {
//         if (err) return res.status(500).send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
//         connection.query(query, [userId, equipmentId, quantity], (err) => {
//             if (err) return res.status(500).send('ไม่สามารถส่งคำขอยืมได้');
//             res.redirect('/users/equipmentList');
//         });
//     });
// };

// controllers/userController.js

exports.borrowEquipment = (req, res) => {
    const equipmentId = req.params.id;
    const userId = req.session.user.id; // ต้องล็อกอินก่อนนะครับ

    req.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            return res.status(500).send('เชื่อมต่อฐานข้อมูลล้มเหลว');
        }

        // ดึงข้อมูลอุปกรณ์มาก่อน
        connection.query('SELECT * FROM equipment WHERE id = ?', [equipmentId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('ดึงข้อมูลล้มเหลว');
            }

            if (results.length === 0) {
                return res.status(404).send('ไม่พบอุปกรณ์นี้');
            }

            const equipment = results[0];

            if (equipment.quantity > 0) {
                // ลดจำนวนลง 1
                connection.query(
                    'UPDATE equipment SET quantity = quantity - 1 WHERE id = ?',
                    [equipmentId],
                    (err, updateResult) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send('อัปเดตข้อมูลล้มเหลว');
                        }

                        // (เลือกทำเพิ่มเติม: เก็บประวัติการยืม)
                        connection.query(
                            'INSERT INTO borrow_records (equipment_id, user_id, quantity_borrowed, borrow_date) VALUES (?, ?, 1, NOW())',
                            [equipmentId, userId],
                            (err, recordResult) => {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).send('บันทึกประวัติยืมล้มเหลว');
                                }

                                // สำเร็จ
                                res.redirect('/users/equipmentList?message=ยืมสำเร็จ');
                            }
                        );
                    }
                );
            } else {
                // จำนวนไม่พอ
                res.redirect('/users/equipmentList?message=❌ อุปกรณ์ไม่พร้อมใช้งาน');
            }
        });
    });
};

