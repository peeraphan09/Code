const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// หน้า login
router.get('/login', (req, res) => {
    res.render('login');  // หน้า login
});

// หน้า register
router.get('/register', (req, res) => {
    res.render('register');  // หน้า register
});

// หน้า homeList (ต้องล็อกอินก่อน)
// router.get('/homeList', (req, res) => {
//     if (!req.session.user) {
//         return res.redirect('/login');  // ถ้ายังไม่เข้าสู่ระบบให้ไปที่หน้า login
//     }
//     res.render('homeList')  // หน้า homeList
// });

router.get('/homeList', (req, res) => {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM users WHERE role = 'user') AS userCount,
            (SELECT COUNT(*) FROM equipment) AS equipmentCount,
            (SELECT COUNT(*) FROM borrow_requests WHERE status = 'pending') AS pendingCount,
            (SELECT COUNT(*) FROM borrow_requests WHERE status = 'approved' AND pickup_status = 'picked_up' AND return_status != 'returned') AS borrowedCount,
            (SELECT COUNT(*) FROM borrow_requests WHERE status = 'approved') AS approvedCount,
            (SELECT COUNT(*) FROM borrow_requests WHERE status = 'rejected') AS rejectedCount
    `;

    req.getConnection((err, conn) => {
        if (err) return res.status(500).send('Database connection error');

        conn.query(sql, (err, results) => {
            if (err) return res.status(500).send('Query error');

            const data = results[0]; // แถวเดียวจาก query

            res.render('homeList', {
                userCount: data.userCount,
                equipmentCount: data.equipmentCount,
                pendingCount: data.pendingCount,
                borrowedCount: data.borrowedCount,
                approvedCount: data.approvedCount,
                rejectedCount: data.rejectedCount
            });
        });
    });
});


// router.get('/homeUS', (req, res) => {
//     if (!req.session.user) {
//         return res.redirect('/login');  // ถ้ายังไม่เข้าสู่ระบบให้ไปที่หน้า login
//     }
//     res.render('homeUS');  // หน้า homeList
// });
router.get('/homeUS', (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.redirect('/login');

    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM borrow_requests WHERE user_id = ?) AS myRequestsCount,
            (SELECT COUNT(*) FROM borrow_requests WHERE user_id = ? AND status = 'pending') AS myPendingCount,
            (SELECT COUNT(*) FROM borrow_requests WHERE user_id = ? AND status = 'approved') AS myApprovedCount,
            (SELECT COUNT(*) FROM borrow_requests WHERE user_id = ? AND status = 'rejected') AS myRejectedCount,
            (SELECT COUNT(*) FROM borrow_requests WHERE user_id = ? AND return_status = 'returned') AS myReturnedCount
    `;

    req.getConnection((err, conn) => {
        if (err) return res.status(500).send('DB Error');

        conn.query(sql, [userId, userId, userId, userId, userId], (err, results) => {
            if (err) return res.status(500).send('Query Error');

            const counts = results[0] || {}; // ป้องกันกรณีไม่มีข้อมูล

            res.render('homeUS', {
                user: req.session.user,
                myRequestsCount: counts.myRequestsCount || 0,
                myPendingCount: counts.myPendingCount || 0,
                myApprovedCount: counts.myApprovedCount || 0,
                myRejectedCount: counts.myRejectedCount || 0,
                myReturnedCount: counts.myReturnedCount || 0
            });
        });
    });
});




// ลงทะเบียน
router.post('/register', authController.postRegister);

// เข้าสู่ระบบ
router.post('/login', authController.postLogin);

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.send('เกิดข้อผิดพลาดในการออกจากระบบ');
      }
      res.redirect('/login');
    });
  });
  
  

module.exports = router;
