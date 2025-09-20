// สร้างผู้ใช้ใหม่
exports.createUser = (req, res) => {
    const { first_name, last_name, email, phone, username, password } = req.body;

    // แฮชรหัสผ่าน
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการแฮชรหัสผ่าน');

        req.getConnection((err, connection) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

            const query = 'INSERT INTO users (first_name, last_name, email, phone, username, password) VALUES (?, ?, ?, ?, ?, ?)';
            connection.query(query, [first_name, last_name, email, phone, username, hashedPassword], (err, result) => {
                if (err) return res.send('เกิดข้อผิดพลาดในการเพิ่มผู้ใช้');
                res.redirect('/admin/user');
            });
        });
    });
};

// แก้ไขข้อมูลผู้ใช้
exports.editUser = (req, res) => {
    const userId = req.params.id;

    req.getConnection((err, connection) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        const query = 'SELECT * FROM users WHERE id = ?';
        connection.query(query, [userId], (err, results) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
            if (results.length === 0) return res.send('ผู้ใช้ไม่พบ');
            res.render('admin/editUser', { user: results[0] });
        });
    });
};

// อัพเดทข้อมูลผู้ใช้
exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, email, phone, username, password } = req.body;

    let updatedPassword = password;

    if (password && password.length >= 8) {
        updatedPassword = bcrypt.hashSync(password, 10);
    }

    req.getConnection((err, connection) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        const query = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, username = ?, password = ? WHERE id = ?';
        connection.query(query, [first_name, last_name, email, phone, username, updatedPassword, userId], (err, result) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการอัพเดทข้อมูลผู้ใช้');
            res.redirect('/admin/user');
        });
    });
};

// ลบผู้ใช้
exports.deleteUser = (req, res) => {
    const userId = req.params.id;

    req.getConnection((err, connection) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        const query = 'DELETE FROM users WHERE id = ?';
        connection.query(query, [userId], (err, result) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการลบผู้ใช้');
            res.redirect('/admin/user');
        });
    });
};

// ดูรายการผู้ใช้ทั้งหมด
exports.getAllUsers = (req, res) => {
    req.getConnection((err, connection) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        const query = 'SELECT * FROM users';
        connection.query(query, (err, results) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
            res.render('admin/user', { users: results });
        });
    });
};
