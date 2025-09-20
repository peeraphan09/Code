const bcrypt = require('bcrypt');

// แสดงหน้า Login
exports.getLogin = (req, res) => {
    res.render('login'); // ต้องมี views/login.ejs
};

// แสดงหน้า Register
exports.getRegister = (req, res) => {
    res.render('register'); // ต้องมี views/register.ejs
};

// POST ลงทะเบียนผู้ใช้ใหม่
exports.postRegister = (req, res) => {
    const { full_name, username, email, phone, password, confirm_password } = req.body;

    if (!username || username.length < 3) return res.send("กรุณากรอก username อย่างน้อย 3 ตัว");
    if (password !== confirm_password) return res.send("รหัสผ่านไม่ตรงกัน");
    if (password.length < 8) return res.send("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัว");
    if (!email || !phone) return res.send("กรุณากรอก email และ phone");

    req.getConnection((err, connection) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        const userData = {
            full_name,
            username,
            email,
            phone,
            password, // plain text
            role: 'user'
        };

        connection.query('INSERT INTO users SET ?', userData, (err, result) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการบันทึกข้อมูล (อาจมี username ซ้ำ)');
            res.redirect('/login');
        });
    });
};


// POST เข้าสู่ระบบ
// POST เข้าสู่ระบบ
exports.postLogin = (req, res) => {
    const { username, password } = req.body;

    req.getConnection((err, connection) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        const query = 'SELECT * FROM users WHERE username = ?';
        connection.query(query, [username], (err, results) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');

            const user = results[0];
            if (!user) return res.send('ผู้ใช้ไม่พบ');

            // ตรวจสอบรหัสผ่านแบบ plain text
            if (password !== user.password) return res.send('รหัสผ่านไม่ถูกต้อง');

            // เก็บ session
            req.session.user = user;
            req.session.userId = user.id;

            // ตรวจสอบ role แล้ว redirect
            if (user.role === 'admin') res.redirect('/homeList');
            else if (user.role === 'user') res.redirect('/homeUS');
            else res.send('Role ของผู้ใช้ไม่ถูกต้อง');
        });
    });
};


// Logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};
// controllers/auth.js หรือ controller register ของคุณ
exports.register = (req, res) => {
    const { full_name, username, email, phone, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.send('รหัสผ่านไม่ตรงกัน');
    }

    req.getConnection((err, connection) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');

        const userData = {
            full_name,
            username,
            email,
            phone,
            password,   // แนะนำให้ hash ด้วย bcrypt ก่อนบันทึก
            role: 'user'
        };

        connection.query('INSERT INTO users SET ?', userData, (err, result) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            res.redirect('/login'); // หรือหน้าต้องการ
        });
    });
};
