// borrowUserController.js

const mysql = require('mysql');
// const moment = require('moment');
const moment = require('moment-timezone');
require('moment/locale/th');

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
exports.borrowEquipment = (req, res) => {
    const userId = req.session.userId;
    const equipmentId = req.params.id;
    const quantity = parseInt(req.body.quantity);
    const returnDate = req.body.return_date;

    if (!userId) return res.redirect('/login');


const query = `
    INSERT INTO borrow_requests (user_id, equipment_id, quantity, return_date, status)
    VALUES (?, ?, ?, ?, 'pending')
`;

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
        connection.query(query, [userId, equipmentId, quantity,  returnDate], (err) => {
            if (err) return res.status(500).send('ไม่สามารถส่งคำขอยืมได้');
            res.redirect('/users/equipmentList');
        });
    });
};

// แสดงรายการยืมอุปกรณ์ของผู้ใช้
exports.showOrderList = (req, res) => {
    const userId = req.session.userId;

    if (!userId) return res.redirect('/login');

//     const query = `
//     SELECT borrow_requests.*, equipment.name AS equipment_name, equipment.equipment_code AS equipment_code, users.first_name, users.last_name,return_date
//     FROM borrow_requests
//     JOIN equipment ON borrow_requests.equipment_id = equipment.id
//     JOIN users ON borrow_requests.user_id = users.id
//    WHERE borrow_requests.user_id = ?
//   AND borrow_requests.return_status != 'returned'
//   AND (borrow_requests.status != 'Rejected' OR borrow_requests.user_acknowledged = 0)
// `;

    const query = `
    SELECT borrow_requests.*, 
           equipment.name AS equipment_name, 
           equipment.equipment_code AS equipment_code,
           equipment.image AS image, -- ✅ เพิ่มตรงนี้
           users.first_name, 
           users.last_name,
           return_date
    FROM borrow_requests
    JOIN equipment ON borrow_requests.equipment_id = equipment.id
    JOIN users ON borrow_requests.user_id = users.id
    WHERE borrow_requests.user_id = ?
    AND borrow_requests.return_status != 'returned'
    AND (borrow_requests.status != 'Rejected' OR borrow_requests.user_acknowledged = 0)
`;

   
    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        connection.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error ในการ query:', err);
                return res.status(500).send('เกิดข้อผิดพลาด: ' + err.message);
            }
            results.forEach(order => {
                if (order.date_borrowed) {
                    order.date_borrowed_th = moment(order.date_borrowed)
                    .add(-7, 'hours')            // กำหนด timezone
                    .locale('th')
                    .add(543, 'years')          // แปลงปีเป็น พ.ศ.
                    .format('D MMMM YYYY เวลา HH:mm') + ' น.';
                }
            });
             results.forEach(order => {
                if (order.return_date) {
                    order.return_date_th = moment(order.return_date)
                    .add(-7, 'hours')            // กำหนด timezone
                    .locale('th')
                    .add(543, 'years')          // แปลงปีเป็น พ.ศ.
                    .format('D MMMM YYYY เวลา HH:mm') + ' น.';
                }
            });
            res.render('users/orderList', { orders: results });
        });
    });
};

// ยกเลิกคำขอยืมอุปกรณ์
exports.cancelBorrowRequest = (req, res) => {
    const borrowRequestId = req.params.id;
    const userId = req.session.userId;

    if (!userId) return res.redirect('/login');

    const query = 'SELECT status, user_id FROM borrow_requests WHERE id = ?';

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        connection.query(query, [borrowRequestId], (err, results) => {
            if (err) return res.status(500).send('เกิดข้อผิดพลาดในการตรวจสอบสถานะคำขอยืม');
            if (results.length === 0) return res.status(404).send('คำขอยืมนี้ไม่พบในระบบ');

            const status = results[0].status;
            const requestUserId = results[0].user_id;

            // ตรวจสอบว่าเจ้าของคำขอยืมคือผู้ใช้ที่ล็อกอิน
            if (userId !== requestUserId) {
                return res.status(403).send('คุณไม่มีสิทธิ์ยกเลิกคำขอยืมนี้');
            }

            // หากสถานะเป็น "pending" ให้ยกเลิกคำขอยืม
            if (status === 'pending') {
                const deleteQuery = 'DELETE FROM borrow_requests WHERE id = ?';

                connection.query(deleteQuery, [borrowRequestId], (err) => {
                    if (err) return res.status(500).send('ไม่สามารถยกเลิกคำขอยืมได้');
                    res.redirect('/users/orderList');
                });
            } else {
                res.status(400).send('ไม่สามารถยกเลิกคำขอที่ไม่ใช่สถานะ "pending" ได้');
            }
        });
    });
};

// controllers/userController.js

exports.confirmPickup = (req, res) => {
    const requestId = req.params.id;

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('Database error');

        const sql = `
            UPDATE borrow_requests 
            SET pickup_status = 'picked_up' 
            WHERE id = ? AND status = 'Approved' AND pickup_status = 'not_picked_up'
        `;
        connection.query(sql, [requestId], (err, result) => {
            if (err) return res.status(500).send('Update error');
            res.redirect('/user/orderList'); // หรือเส้นทางที่แสดงคำขอยืมของ user
        });
    });
};
// exports.confirmReturn = (req, res) => {
//     const requestId = req.params.id;
//     console.log('กำลังอัปเดตการคืน ID:', requestId);

//     req.getConnection((err, connection) => {
//         if (err) {
//             console.error('Database connection error:', err);
//             return res.status(500).send('Database error');
//         }

//         const sql = `
//             UPDATE borrow_requests 
//             SET return_status = 'returned' 
//             WHERE id = ? AND pickup_status = 'picked_up'
//         `;

//         connection.query(sql, [requestId], (err, result) => {
//             if (err) {
//                 console.error('Update error:', err);
//                 return res.status(500).send('Update error');
//             }

//             console.log('ผลลัพธ์:', result);

//             if (result.affectedRows === 0) {
//                 return res.status(400).send('ไม่พบคำขอที่ตรง หรืออาจมีการคืนไปแล้ว');
//             }

//             res.redirect('/user/orderList');
//         });
//     });
// };

exports.confirmReturn = (req, res) => {
    const requestId = req.params.id;

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('Database error');

        // ดึงข้อมูลคำขอ
        const getRequestQuery = `SELECT * FROM borrow_requests WHERE id = ? AND pickup_status = 'picked_up' AND return_status = 'not_returned'`;

        connection.query(getRequestQuery, [requestId], (err, results) => {
            if (err || results.length === 0) return res.status(400).send('ไม่พบคำขอที่สามารถคืนได้');

            const borrow = results[0];

            // 1. เพิ่มลงในตาราง history
            const insertHistory = `
                INSERT INTO borrow_history (user_id, equipment_id, quantity, date_borrowed, date_returned, status)
                VALUES (?, ?, ?, ?, NOW(), 'returned')
            `;
            connection.query(insertHistory, [
                borrow.user_id,
                borrow.equipment_id,
                borrow.quantity,
                borrow.date_borrowed
            ], (err) => {
                if (err) return res.status(500).send('บันทึกประวัติไม่สำเร็จ');

                // 2. อัปเดต return_status
                const updateStatus = `
                    UPDATE borrow_requests SET return_status = 'returned' WHERE id = ?
                `;
                connection.query(updateStatus, [requestId], (err) => {
                    if (err) return res.status(500).send('อัปเดตสถานะคืนล้มเหลว');

                    // 3. คืน stock อุปกรณ์
                    const updateStock = `
                        UPDATE equipment SET quantity = quantity + ? WHERE id = ?
                    `;
                    connection.query(updateStock, [borrow.quantity, borrow.equipment_id], (err) => {
                        if (err) return res.status(500).send('เพิ่ม stock ไม่สำเร็จ');

                        res.redirect('/user/orderList');
                    });
                });
            });
        });
    });
};

exports.showHistory = (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.redirect('/login');

    const query = `
        SELECT bh.*, e.name AS equipment_name, e.equipment_code
        FROM borrow_history bh
        JOIN equipment e ON bh.equipment_id = e.id
        WHERE bh.user_id = ?
        ORDER BY bh.date_returned DESC
    `;

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        connection.query(query, [userId], (err, results) => {
            if (err) return res.status(500).send('ดึงข้อมูลประวัติล้มเหลว');

            // แปลงวันที่เป็นภาษาไทย
            results.forEach(h => {
                if (h.date_borrowed && h.date_returned) {
                    h.date_borrowed_th = moment(h.date_borrowed)
                        .add(-7, 'hours')    
                        .locale('th')
                        .add(543, 'years')
                        .format('D MMM YYYY เวลา HH:mm') + ' น.';
            
                    h.date_returned_th = moment(h.date_returned)
                        .add(-7, 'hours')    
                        .locale('th')
                        .add(543, 'years')
                        .format('D MMM YYYY เวลา HH:mm') + ' น.';
                }
            });

            res.render('users/history', { history: results });
        });
    });
};

exports.acknowledgeRejection = (req, res) => {
    const requestId = req.params.id;

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('เชื่อมต่อฐานข้อมูลล้มเหลว');

        // ตรวจสอบสถานะว่าเป็นคำขอที่ถูกปฏิเสธแล้ว
        const selectQuery = `
            SELECT * FROM borrow_requests 
            WHERE id = ? AND status = 'Rejected' AND user_acknowledged = 0
        `;

        connection.query(selectQuery, [requestId], (err, results) => {
            if (err || results.length === 0) {
                return res.status(400).send('ไม่พบคำขอ หรือรับทราบไปแล้ว');
            }

            const borrow = results[0];

            // 1. บันทึกลง history
            const insertHistory = `
                INSERT INTO borrow_history (user_id, equipment_id, quantity, date_borrowed, date_returned, status)
                VALUES (?, ?, ?, ?, NOW(), 'rejected')
            `;

            connection.query(insertHistory, [
                borrow.user_id,
                borrow.equipment_id,
                borrow.quantity,
                borrow.date_borrowed
            ], (err) => {
                if (err) return res.status(500).send('บันทึกประวัติล้มเหลว');

                // 2. อัปเดตว่า user รับทราบแล้ว
                const updateQuery = `
                    UPDATE borrow_requests 
                    SET user_acknowledged = 1 
                    WHERE id = ?
                `;

                connection.query(updateQuery, [requestId], (err) => {
                    if (err) return res.status(500).send('อัปเดตการรับทราบล้มเหลว');

                    res.redirect('/user/orderList');
                });
            });
        });
    });
};

