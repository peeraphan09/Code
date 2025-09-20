const bcrypt = require('bcrypt');
const validator = require('validator');

// ลงทะเบียนผู้ใช้ใหม่
exports.postRegister = (req, res) => {
    const { first_name, last_name, email, phone, username, password, confirm_password } = req.body;

    // ตรวจสอบว่ารหัสผ่านตรงกับยืนยันรหัสผ่าน
    if (password !== confirm_password) {
        return res.send("รหัสผ่านไม่ตรงกัน");
    }

    // ตรวจสอบอีเมลว่าถูกต้องตามรูปแบบหรือไม่
    if (!validator.isEmail(email)) {
        return res.send("อีเมลไม่ถูกต้อง");
    }

    // ตรวจสอบว่ารหัสผ่านมีความยาวอย่างน้อย 8 ตัว
    if (password.length < 8) {
        return res.send("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัว");
    }

    // แทนที่การแฮชรหัสผ่านด้วยการเก็บรหัสผ่านเป็นข้อความธรรมดา
    req.getConnection((err, connection) => {
        if (err) return res.send('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
        
        const query = 'INSERT INTO users (first_name, last_name, email, phone, username, password) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(query, [first_name, last_name, email, phone, username, password], (err, result) => {
            if (err) return res.send('เกิดข้อผิดพลาดในการลงทะเบียน');
            res.redirect('/login');  // ไปที่หน้า Login หลังจากลงทะเบียน
        });
    });
};

// เข้าสู่ระบบ
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

            // ตรวจสอบรหัสผ่านแบบ plain text
            if (password === user.password) {
                // เก็บข้อมูลผู้ใช้ใน session
                req.session.user = user;
                req.session.userId = user.id;

                // ตรวจสอบว่าเป็น admin หรือ user
                if (user.role === 'admin') {
                    res.redirect('/homeList');  // ถ้าเป็น admin ไปหน้า homeList
                } else if (user.role === 'user') {
                    res.redirect('/homeUS');  // ถ้าเป็น user ไปหน้า homeUS
                } else {
                    res.send('Role ของผู้ใช้ไม่ถูกต้อง');
                }
            } else {
                res.send('รหัสผ่านไม่ถูกต้อง');
            }
        });
    });
};

