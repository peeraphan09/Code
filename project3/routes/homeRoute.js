// // const express = require('express');
// // const router = express.Router();

// // const home = require('../controllers/home'); // ตรวจสอบเส้นทางให้ถูกต้อง

// // if (!home.list) {
// //     console.error("Error: 'list' function is not found in home controller");
// // }

// // router.get('/', home.list);
// // router.post('/home', home.list);

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const homeController = require('../controllers/home'); // Import controller

// router.get('/home', homeController.home); 


// router.get('/homeList', (req, res) => {
//     const sql = `
//         SELECT 
//             (SELECT COUNT(*) FROM users WHERE role = 'user') AS userCount,
//             (SELECT COUNT(*) FROM equipment) AS equipmentCount,
//             (SELECT COUNT(*) FROM borrow_requests WHERE status = 'pending') AS pendingCount,
//             (SELECT COUNT(*) FROM borrow_requests WHERE status = 'approved' AND pickup_status = 'picked_up' AND return_status != 'returned') AS borrowedCount,
//             (SELECT COUNT(*) FROM borrow_requests WHERE status = 'approved') AS approvedCount,
//             (SELECT COUNT(*) FROM borrow_requests WHERE status = 'rejected') AS rejectedCount
//     `;

//     req.getConnection((err, conn) => {
//         if (err) return res.status(500).send('Database error');

//         conn.query(sql, (err, results) => {
//             if (err) return res.status(500).send('Query error');

//             const data = results[0]; // ดึงข้อมูลแถวเดียวจาก query
//             res.render('/homeList', {
//                 userCount: data.userCount,
//                 equipmentCount: data.equipmentCount,
//                 pendingCount: data.pendingCount,
//                 borrowedCount: data.borrowedCount,
//                 approvedCount: data.approvedCount,
//                 rejectedCount: data.rejectedCount
//             });
//         });
//     });
// });

// router.get('/homeUS', (req, res) => {
//     const userId = req.session.user?.id;
//     if (!userId) return res.redirect('/login');

//     const sql = `
//         SELECT 
//             (SELECT COUNT(*) FROM borrow_requests WHERE user_id = ?) AS myRequestsCount,
//             (SELECT COUNT(*) FROM borrow_requests WHERE user_id = ? AND status = 'pending') AS myPendingCount,
//             (SELECT COUNT(*) FROM borrow_requests WHERE user_id = ? AND status = 'approved') AS myApprovedCount,
//             (SELECT COUNT(*) FROM borrow_requests WHERE user_id = ? AND status = 'rejected') AS myRejectedCount,
//             (SELECT COUNT(*) FROM borrow_requests WHERE user_id = ? AND return_status = 'returned') AS myReturnedCount
//     `;

//     req.getConnection((err, conn) => {
//         if (err) return res.status(500).send('DB Error');

//         conn.query(sql, [userId, userId, userId, userId, userId], (err, results) => {
//             if (err) return res.status(500).send('Query Error');

//             const counts = results[0] || {}; // ป้องกันกรณีไม่มีข้อมูล

//             res.render('homeUS', {
//                 user: req.session.user,
//                 myRequestsCount: counts.myRequestsCount || 0,
//                 myPendingCount: counts.myPendingCount || 0,
//                 myApprovedCount: counts.myApprovedCount || 0,
//                 myRejectedCount: counts.myRejectedCount || 0,
//                 myReturnedCount: counts.myReturnedCount || 0
//             });
//         });
//     });
// });


// // หน้า login
// router.get('/login', homeController.getLogin);

// // POST login เพื่อจัดการการล็อกอิน
// router.post('/login', homeController.postLogin);

// // หน้า homeList สำหรับ admin
// router.get('/homeList', homeController.getHomeList);

// // หน้า homeUS สำหรับ user
// router.get('/homeUS', homeController.getHomeUS);


// // หน้า logout
// router.get('/logout', homeController.logout);

// router.get('/logout', (req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             return res.send('เกิดข้อผิดพลาดในการออกจากระบบ');
//         }
//         res.redirect('/login');  // กลับไปหน้าล็อกอิน
//     });
// });


// module.exports = router;


// const express = require('express');
// const router = express.Router();

// const home = require('../controllers/home'); // ตรวจสอบเส้นทางให้ถูกต้อง

// if (!home.list) {
//     console.error("Error: 'list' function is not found in home controller");
// }

// router.get('/', home.list);
// router.post('/home', home.list);

// module.exports = router;

const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home'); // Import controller

router.get('/home', homeController.home); 


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
        if (err) return res.status(500).send('Database error');

        conn.query(sql, (err, results) => {
            if (err) return res.status(500).send('Query error');

            const data = results[0]; // ดึงข้อมูลแถวเดียวจาก query
            res.render('/homeList', {
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


// หน้า login
router.get('/login', homeController.getLogin);

// POST login เพื่อจัดการการล็อกอิน
router.post('/login', homeController.postLogin);

// หน้า homeList สำหรับ admin
router.get('/homeList', homeController.getHomeList);

// หน้า homeUS สำหรับ user
router.get('/homeUS', homeController.getHomeUS);


// หน้า logout
router.get('/logout', homeController.logout);

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('เกิดข้อผิดพลาดในการออกจากระบบ');
        }
        res.redirect('/login');  // กลับไปหน้าล็อกอิน
    });
});


module.exports = router;


