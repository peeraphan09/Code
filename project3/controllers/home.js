// ฟังก์ชั่นเพื่อแสดงหน้า login
exports.getLogin = (req, res) => {
    res.render('login');
};

exports.postLogin = (req, res) => {
    const { username, password } = req.body;

    req.getConnection((err, connection) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
        connection.query(query, [username, username], (err, results) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');

            const user = results[0];

            if (!user) {
                return res.send('ผู้ใช้ไม่พบ');
            }

            if (password === user.password) { // ตรวจสอบรหัสผ่าน
                req.session.user = { 
                    id: user.id, 
                    username: user.username,
                    role: user.role
                };

                // เช็ค role แล้ว redirect ไปหน้า home ที่ถูกต้อง
                if (user.role === 'admin') {
                    res.redirect('/homeList');
                } else {
                    res.redirect('/homeUS');
                }
            } else {
                res.send('รหัสผ่านไม่ถูกต้อง');
            }
        });
    });
};


// ฟังก์ชั่นสำหรับหน้า homeList สำหรับ admin
exports.getHomeList = (req, res) => {
    if (req.session.loggedin && req.session.role === 'admin') {
        res.render('homeList');
    } else {
        res.redirect('/login'); // หากไม่ได้ล็อกอินเป็น admin จะให้กลับไปหน้า login
    }
};

// controllers/home.js
// exports.getHomeList = (req, res) => {
//     if (!req.session.user || req.session.user.role !== 'admin') {
//         return res.redirect('/login');
//     }

//     req.getConnection((err, connection) => {
//         if (err) {
//             return res.status(500).send('Database connection error');
//         }

//         const stats = {};
//         const queries = [
//             { key: 'total_equipment', sql: 'SELECT COUNT(*) AS count FROM equipment' },
//             { key: 'remaining_equipment', sql: 'SELECT SUM(quantity) AS count FROM equipment' },
//             { key: 'pending', sql: "SELECT COUNT(*) AS count FROM borrow_requests WHERE status = 'pending'" },
//             { key: 'approved', sql: "SELECT COUNT(*) AS count FROM borrow_requests WHERE status = 'approved'" },
//             { key: 'rejected', sql: "SELECT COUNT(*) AS count FROM borrow_requests WHERE status = 'rejected'" },
//             { key: 'picked_up', sql: "SELECT COUNT(*) AS count FROM borrow_requests WHERE pickup_status = 'picked_up'" }
//         ];

//         let completed = 0;

//         queries.forEach(q => {
//             connection.query(q.sql, (err, result) => {
//                 if (err) {
//                     return res.status(500).send('Query error');
//                 }

//                 stats[q.key] = result[0].count || 0;
//                 completed++;

//                 if (completed === queries.length) {
//                     res.render('homeList', { stats });
//                 }
//             });
//         });
//     });
// };


// ฟังก์ชั่นสำหรับหน้า homeUS สำหรับ user
exports.getHomeUS = (req, res) => {
    if (req.session.loggedin && req.session.role === 'user') {
        res.render('homeUS');
    } else {
        res.redirect('/login'); // หากไม่ได้ล็อกอินเป็น user จะให้กลับไปหน้า login
    }
};
exports.home = (req, res) => {
    // ตรวจสอบว่า session มีข้อมูลผู้ใช้หรือไม่
    if (!req.session.user) {
        return res.redirect('/login');  // ถ้าไม่มี session ให้ไปหน้า login
    }

    // ตรวจสอบว่าเป็น admin หรือ user
    if (req.session.user.role === 'admin') {
        // ถ้าเป็น admin ให้ไปหน้า homeList
        return res.render('homeList');  // หน้า homeList สำหรับ admin
    } else if (req.session.user.role === 'user') {
        // ถ้าเป็น user ให้ไปหน้า homeUS
        return res.render('homeUS');  // หน้า homeUS สำหรับ user
    } else {
        return res.send("Role ไม่ถูกต้อง");
    }
};

// ฟังก์ชั่นสำหรับ logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error logging out');
        }
        res.redirect('/login');
    });
};

