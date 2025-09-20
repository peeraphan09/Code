// // controllers/adminController.js

// // แสดงรายการอุปกรณ์ทั้งหมด
// // controllers/equipmentController.js
// // controllers/adminController.js
// exports.getEquipmentList = (req, res) => {
//     req.getConnection((err, connection) => {
//         if (err) return res.send('❌ Database connection error');

//         connection.query('SELECT * FROM equipment', (err, equipment) => {
//             if (err) return res.send('❌ Query error');

//             // ✅ ตรวจสอบว่ามี session.user ไหม
//             const user = req.session.user || null;

//             res.render('admin/equipmentList', {
//                 title: 'รายการอุปกรณ์',
//                 equipment: equipment,
//                 user: user  // ✅ ส่ง user ไปที่ EJS
//             });
//         });
//     });
// };

// // ฟอร์มเพิ่มอุปกรณ์ใหม่
// exports.getAddEquipment = (req, res) => {
//     res.render('admin/addEquipment');
// };

// // เพิ่มอุปกรณ์ใหม่
// exports.addEquipment = (req, res) => {
//     const { equipment_code, name, category, quantity, status } = req.body;
//     const approval_status = 'pending'; 

//     req.getConnection((err, conn) => {
//         if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

//         conn.query(
//             'INSERT INTO equipment (equipment_code, name, category, quantity, status, approval_status) VALUES (?, ?, ?, ?, ?, ?)', 
//             [equipment_code, name, category, quantity, status, approval_status], 
//             (err) => {
//                 if (err) return res.send('เกิดข้อผิดพลาดในการเพิ่มอุปกรณ์');
//                 res.redirect('/admin/equipmentList');
//             }
//         );
//     });
// };

// // ฟอร์มแก้ไขอุปกรณ์
// exports.editEquipment = (req, res) => {
//     const equipmentId = req.params.id;

//     req.getConnection((err, connection) => {
//         if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
        
//         connection.query('SELECT * FROM equipment WHERE id = ?', [equipmentId], (err, results) => {
//             if (err) return res.send('เกิดข้อผิดพลาดในการดึงข้อมูลอุปกรณ์');
            
//             res.render('admin/editEquipment', { equipment: results[0] });
//         });
//     });
// };

// // อัพเดตอุปกรณ์
// exports.updateEquipment = (req, res) => {
//     const { id, equipment_code, name, category, quantity, status, approval_status } = req.body;

//     req.getConnection((err, connection) => {
//         if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
        
//         const query = 'UPDATE equipment SET equipment_code = ?, name = ?, category = ?, quantity = ?, status = ?, approval_status = ? WHERE id = ?';
//         connection.query(query, [equipment_code, name, category, quantity, status, approval_status, id], (err, result) => {
//             if (err) return res.send('เกิดข้อผิดพลาดในการอัพเดตข้อมูลอุปกรณ์');
            
//             res.redirect('/admin/equipmentList');  // ไปที่หน้าแสดงรายการอุปกรณ์
//         });
//     });
// };

// // ลบอุปกรณ์
// exports.deleteEquipment = (req, res) => {
//     const equipmentId = req.params.id;

//     req.getConnection((err, connection) => {
//         if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
        
//         const query = 'DELETE FROM equipment WHERE id = ?';
//         connection.query(query, [equipmentId], (err, result) => {
//             if (err) return res.send('เกิดข้อผิดพลาดในการลบอุปกรณ์');
            
//             res.redirect('/admin/equipmentList');  // ไปที่หน้าแสดงรายการอุปกรณ์
//         });
//     });
// };


exports.getEquipmentList = (req, res) => {
    req.getConnection((err, connection) => {
      if (err) return res.send('Database connection error');
  
      connection.query('SELECT * FROM equipment', (err, equipment) => {
        if (err) return res.send('Query error');
        res.render('admin/equipmentList', {
          title: 'รายการอุปกรณ์',
          equipment: equipment,
          user: req.session.user || null
        });
      });
    });
  };
  
  exports.getAddEquipment = (req, res) => {
    res.render('admin/addEquipment');
  };
  
// controllers/adminController.js
exports.addEquipment = (req, res) => {
    const { equipment_code, name, category, quantity, status } = req.body;
    const approval_status = 'pending';
    const imagePath = req.file ? '/uploads/' + req.file.filename : null;  // ถ้ามีการอัปโหลดภาพ จะบันทึก path

    req.getConnection((err, conn) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        conn.query(
            'INSERT INTO equipment (equipment_code, name, category, quantity, status, approval_status, image) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [equipment_code, name, category, quantity, status, approval_status, imagePath], 
            (err) => {
                if (err) return res.send('เกิดข้อผิดพลาดในการเพิ่มอุปกรณ์');
                res.redirect('/admin/equipmentList');
            }
        );
    });
};

  exports.editEquipment = (req, res) => {
    const equipmentId = req.params.id;
    req.getConnection((err, connection) => {
      if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
      connection.query('SELECT * FROM equipment WHERE id = ?', [equipmentId], (err, results) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการดึงข้อมูลอุปกรณ์');
        res.render('admin/editEquipment', { equipment: results[0] });
      });
    });
  };
  
  exports.updateEquipment = (req, res) => {
    const { id, equipment_code, name, category, quantity, status } = req.body;  // ไม่มี approval_status
    const image = req.file ? '/uploads/' + req.file.filename : null;

    req.getConnection((err, connection) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        let query, params;

        if (image) {
            query = 'UPDATE equipment SET equipment_code = ?, name = ?, category = ?, quantity = ?, status = ?, image = ? WHERE id = ?';
            params = [equipment_code, name, category, quantity, status, image, id];  // ใส่เฉพาะ filename
        } else {
            query = 'UPDATE equipment SET equipment_code = ?, name = ?, category = ?, quantity = ?, status = ? WHERE id = ?';
            params = [equipment_code, name, category, quantity, status, id];
        }

        connection.query(query, params, (err) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
            res.redirect('/admin/equipmentList');
        });
    });
};

  
  exports.deleteEquipment = (req, res) => {
    const equipmentId = req.params.id;
    req.getConnection((err, connection) => {
      if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
      connection.query('DELETE FROM equipment WHERE id = ?', [equipmentId], (err) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการลบอุปกรณ์');
        res.redirect('/admin/equipmentList');
      });
    });
  };
  
  exports.getBorrowRequests = (req, res) => {
    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        const query = `
            SELECT br.id, u.username, e.name AS equipment_name
            FROM borrow_requests br
            JOIN users u ON br.user_id = u.id
            JOIN equipment e ON br.equipment_id = e.id
            WHERE br.status = 'pending'
        `;

        connection.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('ไม่สามารถดึงข้อมูลคำขอได้');
            }
            res.render('admin/equipmentApproval', { borrowRequests: results });
        });
    });
};

exports.approveRequest = (req, res) => {
    const id = req.params.id;

    const getRequestQuery = `
        SELECT equipment_id
        FROM borrow_requests
        WHERE id = ?
    `;

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        connection.query(getRequestQuery, [id], (err, results) => {
            if (err) return res.status(500).send('ไม่สามารถดึงข้อมูลคำขอได้');
            if (results.length === 0) return res.status(404).send('ไม่พบคำขอนี้');

            const equipmentId = results[0].equipment_id;

            // 1. อนุมัติคำขอ
            const approveQuery = `UPDATE borrow_requests SET status = 'approved' WHERE id = ?`;

            connection.query(approveQuery, [id], (err) => {
                if (err) return res.status(500).send('อนุมัติไม่สำเร็จ');

                // 2. ลดจำนวน quantity ของอุปกรณ์
                const updateEquipmentQuery = `
                    UPDATE equipment
                    SET quantity = quantity - 1
                    WHERE id = ? AND quantity > 0
                `;

                connection.query(updateEquipmentQuery, [equipmentId], (err) => {
                    if (err) return res.status(500).send('ลดจำนวนอุปกรณ์ไม่สำเร็จ');

                    // 3. เช็คว่าจำนวนอุปกรณ์เป็น 0 ไหม -> ถ้าใช่ เปลี่ยน status เป็น unavailable
                    const checkQuantityQuery = `
                        SELECT quantity FROM equipment WHERE id = ?
                    `;

                    connection.query(checkQuantityQuery, [equipmentId], (err, result) => {
                        if (err) return res.status(500).send('ดึงจำนวนอุปกรณ์ไม่สำเร็จ');

                        const quantity = result[0].quantity;

                        if (quantity === 0) {
                            const updateStatusQuery = `
                                UPDATE equipment SET status = 'unavailable' WHERE id = ?
                            `;
                            connection.query(updateStatusQuery, [equipmentId], (err) => {
                                if (err) return res.status(500).send('อัปเดตสถานะอุปกรณ์ไม่สำเร็จ');

                                res.redirect('/admin/equipmentApproval');
                            });
                        } else {
                            res.redirect('/admin/equipmentApproval');
                        }
                    });
                });
            });
        });
    });
};



exports.rejectRequest = (req, res) => {
    const id = req.params.id;
    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        const query = `UPDATE borrow_requests SET status = 'rejected' WHERE id = ?`;

        connection.query(query, [id], (err) => {
            if (err) return res.status(500).send('ปฏิเสธไม่สำเร็จ');
            res.redirect('/admin/equipmentApproval');  // ✅ เสร็จแล้ว
        });
    });
};

exports.viewHistory = (req, res) => {
    const sql = `
        SELECT bh.*, u.first_name, u.last_name, e.name AS equipment_name, e.equipment_code
        FROM borrow_history bh
        JOIN users u ON bh.user_id = u.id
        JOIN equipment e ON bh.equipment_id = e.id
        ORDER BY bh.date_borrowed DESC
    `;

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('Database error');

        connection.query(sql, (err, results) => {
            if (err) return res.status(500).send('Query error');

            res.render('admin/adminHistory', { historyRecords: results });
        });
    });
};
