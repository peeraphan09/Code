// controllers/borrowRequestController.js

// ดึงข้อมูลคำขอยืมที่รออนุมัติ
// ดึงข้อมูลคำขอยืมที่รออนุมัติ
// exports.approveRequest = (req, res) => {
//     const sql = `
//         SELECT br.id, br.user_id, br.equipment_id, br.quantity, br.status, 
//                u.first_name, u.last_name, e.name AS equipment_name, equipment_code
//         FROM borrow_requests br
//         JOIN users u ON br.user_id = u.id
//         JOIN equipment e ON br.equipment_id = e.id
//         WHERE br.status = "Pending"
//     `;

//     req.getConnection((err, connection) => {
//         if (err) throw err;
//         connection.query(sql, (err, results) => {
//             if (err) throw err;
//             res.render('admin/adminApproveRequests', { borrowRequests: results });
//         });
//     });
// };

// exports.updateRequestStatus = (req, res) => {
//     const requestId = req.params.id;
//     const action = req.body.action;  // "approve" หรือ "reject"
//     const status = action === 'approve' ? 'Approved' : 'Rejected';

//     req.getConnection((err, connection) => {
//         if (err) return res.status(500).send('Database connection error');

//         // ดึงข้อมูล borrow request มาก่อน
//         const getRequestQuery = 'SELECT equipment_id, quantity FROM borrow_requests WHERE id = ?';
//         connection.query(getRequestQuery, [requestId], (err, requestResult) => {
//             if (err) return res.status(500).send('Error fetching request details');

//             if (requestResult.length === 0) {
//                 return res.status(404).send('Request not found');
//             }

//             const equipmentId = requestResult[0].equipment_id;
//             const quantityRequested = requestResult[0].quantity;

//             if (action === 'approve') {
//                 // ดึงจำนวนคงเหลือของอุปกรณ์
//                 const getEquipmentQuery = 'SELECT quantity FROM equipment WHERE id = ?';
//                 connection.query(getEquipmentQuery, [equipmentId], (err, equipmentResult) => {
//                     if (err) return res.status(500).send('Error fetching equipment details');

//                     if (equipmentResult.length === 0) {
//                         return res.status(404).send('Equipment not found');
//                     }

//                     const quantityAvailable = equipmentResult[0].quantity;

//                     if (quantityAvailable < quantityRequested) {
//                         // ❌ ถ้าอุปกรณ์ไม่พอ
//                         return res.send(`
//                             <script>
//                                 alert('จำนวนอุปกรณ์ไม่เพียงพอในการอนุมัติคำขอนี้');
//                                 window.location.href = '/admin/adminApproveRequests';
//                             </script>
//                         `);
//                     }

//                     // ✅ ถ้าอุปกรณ์พอ: อัปเดต status และจำนวนอุปกรณ์
//                     connection.beginTransaction(err => {
//                         if (err) return res.status(500).send('Transaction error');

//                         const updateStatusQuery = 'UPDATE borrow_requests SET status = ? WHERE id = ?';
//                         connection.query(updateStatusQuery, [status, requestId], (err, result) => {
//                             if (err) {
//                                 return connection.rollback(() => {
//                                     res.status(500).send('Error updating request status');
//                                 });
//                             }

//                             const updateEquipmentQuery = 'UPDATE equipment SET quantity = quantity - ? WHERE id = ?';
//                             connection.query(updateEquipmentQuery, [quantityRequested, equipmentId], (err, result) => {
//                                 if (err) {
//                                     return connection.rollback(() => {
//                                         res.status(500).send('Error updating equipment quantity');
//                                     });
//                                 }

//                                 connection.commit(err => {
//                                     if (err) {
//                                         return connection.rollback(() => {
//                                             res.status(500).send('Commit error');
//                                         });
//                                     }
//                                     res.redirect('/admin/adminApproveRequests');
//                                 });
//                             });
//                         });
//                     });
//                 });
//             } else {
//                 // ถ้า action คือ reject (ไม่ต้องเช็กอุปกรณ์)
//                 const updateStatusQuery = 'UPDATE borrow_requests SET status = ? WHERE id = ?';
//                 connection.query(updateStatusQuery, [status, requestId], (err, result) => {
//                     if (err) return res.status(500).send('Error updating request status');

//                     res.redirect('/admin/adminApproveRequests');
//                 });
//             }
//         });
//     });
// };

// controllers/adminController.js

// exports.approveRequest = (req, res) => {
//     const sql = `
//         SELECT br.id, br.user_id, br.equipment_id, br.quantity, br.status, br.pickup_status,
//                u.first_name, u.last_name, e.name AS equipment_name, equipment_code
//         FROM borrow_requests br
//         JOIN users u ON br.user_id = u.id
//         JOIN equipment e ON br.equipment_id = e.id
//         WHERE br.status = "Pending"
//     `;

//     req.getConnection((err, connection) => {
//         if (err) throw err;
//         connection.query(sql, (err, results) => {
//             if (err) throw err;
//             res.render('admin/adminApproveRequests', { borrowRequests: results });
//         });
//     });
// };

exports.approveRequest = (req, res) => {
//     const sql = `
//         SELECT br.id, br.user_id, br.equipment_id, br.quantity, br.status, br.pickup_status, br.return_status,
//                u.first_name, u.last_name,
//                e.name AS equipment_name, e.equipment_code,
//                bh.date_returned
//         FROM borrow_requests br
//         JOIN users u ON br.user_id = u.id
//         JOIN equipment e ON br.equipment_id = e.id
//         LEFT JOIN borrow_history bh
//             ON br.user_id = bh.user_id
//             AND br.equipment_id = bh.equipment_id
//             AND bh.status = 'returned'
//             AND bh.date_returned IS NOT NULL
//         ORDER BY CASE 
//         WHEN bh.status = 'pending' THEN 0
//         WHEN bh.status = 'approved' THEN 1
//         ELSE 2
//       END,
//       bh.date_borrowed DESC
// `;

// const sql = `
//     SELECT br.id, br.user_id, br.equipment_id, br.quantity, br.status, br.pickup_status, br.return_status,
//            br.request_date,
//            u.first_name, u.last_name,
//            e.name AS equipment_name, e.equipment_code,
//            bh.date_returned
//     FROM borrow_requests br
//     JOIN users u ON br.user_id = u.id
//     JOIN equipment e ON br.equipment_id = e.id
//     LEFT JOIN borrow_history bh
//         ON br.user_id = bh.user_id
//         AND br.equipment_id = bh.equipment_id
//         AND bh.status = 'returned'
//         AND bh.date_returned IS NOT NULL
//     ORDER BY CASE 
//         WHEN bh.status = 'pending' THEN 0
//         WHEN bh.status = 'approved' THEN 1
//         ELSE 2
//     END,
//     bh.date_borrowed DESC
// `;

//     req.getConnection((err, connection) => {
//         if (err) throw err;
//         connection.query(sql, (err, results) => {
//             if (err) throw err;
//             res.render('admin/adminApproveRequests', { borrowRequests: results });
//         });
//     });
// };

const sql = `
        SELECT br.id, br.user_id, br.equipment_id, br.quantity, br.status, br.pickup_status, br.return_status,
               br.request_date, br.return_date,  -- เพิ่ม return_date
               u.first_name, u.last_name,
               e.name AS equipment_name, e.equipment_code
        FROM borrow_requests br
        JOIN users u ON br.user_id = u.id
        JOIN equipment e ON br.equipment_id = e.id
        WHERE br.status = "Pending" OR br.status = "Approved"
        ORDER BY br.request_date DESC
    `;

    req.getConnection((err, connection) => {
        if (err) throw err;
        connection.query(sql, (err, results) => {
            if (err) throw err;
            res.render('admin/adminApproveRequests', { borrowRequests: results });
        });
    });
};

exports.updateRequestStatus = (req, res) => {
    const requestId = req.params.id;
    const action = req.body.action;
    const status = action === 'approve' ? 'Approved' : 'Rejected';

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('Database connection error');

        const getRequestQuery = 'SELECT equipment_id, quantity FROM borrow_requests WHERE id = ?';
        connection.query(getRequestQuery, [requestId], (err, requestResult) => {
            if (err) return res.status(500).send('Error fetching request details');
            if (requestResult.length === 0) return res.status(404).send('Request not found');

            const equipmentId = requestResult[0].equipment_id;
            const quantityRequested = requestResult[0].quantity;

            if (action === 'approve') {
                const getEquipmentQuery = 'SELECT quantity FROM equipment WHERE id = ?';
                connection.query(getEquipmentQuery, [equipmentId], (err, equipmentResult) => {
                    if (err) return res.status(500).send('Error fetching equipment details');
                    if (equipmentResult.length === 0) return res.status(404).send('Equipment not found');

                    const quantityAvailable = equipmentResult[0].quantity;
                    if (quantityAvailable < quantityRequested) {
                        return res.send(`
                            <script>
                                alert('จำนวนอุปกรณ์ไม่เพียงพอในการอนุมัติคำขอนี้');
                                window.location.href = '/admin/adminApproveRequests';
                            </script>
                        `);
                    }

                    connection.beginTransaction(err => {
                        if (err) return res.status(500).send('Transaction error');

                        const updateRequestQuery = 'UPDATE borrow_requests SET status = ?, pickup_status = ? WHERE id = ?';
                        connection.query(updateRequestQuery, [status, 'not_picked_up', requestId], (err) => {
                            if (err) return connection.rollback(() => res.status(500).send('Error updating request'));

                            const updateEquipmentQuery = 'UPDATE equipment SET quantity = quantity - ? WHERE id = ?';
                            connection.query(updateEquipmentQuery, [quantityRequested, equipmentId], (err) => {
                                if (err) return connection.rollback(() => res.status(500).send('Error updating equipment'));

                                connection.commit(err => {
                                    if (err) return connection.rollback(() => res.status(500).send('Commit error'));
                                    res.redirect('/admin/adminApproveRequests');
                                });
                            });
                        });
                    });
                });
            } else {
                const updateStatusQuery = 'UPDATE borrow_requests SET status = ? WHERE id = ?';
                connection.query(updateStatusQuery, [status, requestId], (err) => {
                    if (err) return res.status(500).send('Error updating request status');
                    res.redirect('/admin/adminApproveRequests');
                });
            }
        });
    });
};
