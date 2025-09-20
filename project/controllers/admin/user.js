// controllers/admin/user.js

// ดึงข้อมูลผู้ใช้ทั้งหมด (role = user)
// ดึงข้อมูลผู้ใช้ทั้งหมด (รวม admin)
exports.listUsers = (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    if (req.session.user.role !== 'admin') return res.send('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');

    req.getConnection((err, connection) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        // เอาทุกคน ไม่กรอง role
        connection.query('SELECT * FROM users', (err, results) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');

            res.render('admin/user/user', { users: results, admin: req.session.user });
        });
    });
};


// ลบผู้ใช้
exports.deleteUser = (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    if (req.session.user.role !== 'admin') return res.send('คุณไม่มีสิทธิ์ลบผู้ใช้');

    const userId = req.params.id;

    req.getConnection((err, connection) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        connection.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการลบผู้ใช้');
            res.redirect('/admin/user/user');
        });
    });
};
// ดึงข้อมูล user สำหรับแก้ไข
exports.editUserForm = (req, res) => {
    const userId = req.params.id;
    req.getConnection((err, connection) => {
        if (err) return res.send('DB connection error');

        connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
            if (err) return res.send('DB query error');
            if (!results[0]) return res.send('ไม่พบผู้ใช้');

            res.render('admin/user/userEdit', { user: results[0], admin: req.session.user });
        });
    });
};

// อัปเดต role
exports.updateUserRole = (req, res) => {
    const userId = req.params.id;
    const newRole = req.body.role;

    req.getConnection((err, connection) => {
        if (err) return res.send('DB connection error');

        connection.query('UPDATE users SET role = ? WHERE id = ?', [newRole, userId], (err, result) => {
            if (err) return res.send('DB update error');
            res.redirect('/admin/user');
        });
    });
};
