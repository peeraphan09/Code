const path = require('path');
const fs = require('fs');

// exports.getProfile = (req, res) => {
//     if (!req.session.user) return res.redirect('/login');

//     const message = req.session.successMessage;
//     delete req.session.successMessage;

//     res.render('users/profile', {
//         user: req.session.user,
//         successMessage: message
//     });
// };

// exports.updateProfile = (req, res) => {
//     const db = req.db;
//     const user = req.session.user;
//     if (!user) return res.redirect('/login');

//     // ✅ ดึงข้อมูลเพิ่มจากฟอร์ม
//     const { first_name, last_name, phone, email } = req.body;
//     let profileImage = user.profile_image;

//     if (req.file) {
//         profileImage = '/uploads/' + req.file.filename;

//         if (user.profile_image && user.profile_image !== '/images/default-profile.png') {
//             const oldPath = path.join(__dirname, '..', 'public', user.profile_image);
//             fs.unlink(oldPath, (err) => {
//                 if (err) console.log('ลบไฟล์เก่าไม่สำเร็จ:', err);
//             });
//         }
//     }

//     const sql = 'UPDATE users SET first_name = ?, last_name = ?, phone = ?, email = ?, profile_image = ? WHERE id = ?';
//     db.query(sql, [first_name, last_name, phone, email, profileImage, user.id], (err) => {
//         if (err) return res.status(500).send('เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');

//         // ✅ อัปเดตข้อมูลใน session
//         req.session.user.first_name = first_name;
//         req.session.user.last_name = last_name;
//         req.session.user.phone = phone;
//         req.session.user.email = email;
//         req.session.user.profile_image = profileImage;

//         req.session.successMessage = 'อัปเดตข้อมูลเรียบร้อยแล้ว';
//         res.redirect('/user/profile');
//     });
// };

exports.getProfile = (req, res) => {
    const user = req.session.user || req.session.admin;
    if (!user) return res.redirect('/login');

    const viewPath = req.originalUrl.includes('/admin') ? 'admin/adminprofile' : 'users/profile';
    res.render(viewPath, { user, successMessage: req.session.successMessage });
    delete req.session.successMessage;
};

exports.updateProfile = (req, res) => {
    const db = req.db;
    const user = req.session.user || req.session.admin;
    if (!user) return res.redirect('/login');

    const { first_name, last_name, phone, email } = req.body;
    let profileImage = user.profile_image;

    if (req.file) {
        profileImage = '/uploads/' + req.file.filename;

        if (user.profile_image && user.profile_image !== '/images/default-profile.png') {
            const oldPath = path.join(__dirname, '..', 'public', user.profile_image);
            fs.unlink(oldPath, (err) => {
                if (err) console.log('ลบไฟล์เก่าไม่สำเร็จ:', err);
            });
        }
    }

    const sql = 'UPDATE users SET first_name = ?, last_name = ?, phone = ?, email = ?, profile_image = ? WHERE id = ?';
    db.query(sql, [first_name, last_name, phone, email, profileImage, user.id], (err) => {
        if (err) return res.status(500).send('เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');

        user.first_name = first_name;
        user.last_name = last_name;
        user.phone = phone;
        user.email = email;
        user.profile_image = profileImage;

        req.session.successMessage = 'อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว';

        const redirectPath = req.originalUrl.includes('/admin') ? '/admin/adminprofile' : '/user/profile';
        res.redirect(redirectPath);
    });
};
