// หน้า Home Admin
exports.homeList = (req, res) => {
    // ตรวจสอบว่ามี session ผู้ใช้
    if (!req.session.user) return res.redirect('/login');

    // ตรวจสอบ role ว่าเป็น admin
    if (req.session.user.role !== 'admin') {
        return res.send('คุณไม่สามารถเข้าหน้านี้ได้');
    }

    // Render หน้า homeList.ejs พร้อมส่งข้อมูล user
    res.render('homeList', { user: req.session.user });
};

// exports.homeList = (req, res) => {
//     // ✅ ตรวจสอบว่ามี session ผู้ใช้
//     if (!req.session.user) return res.redirect('/login');

//     // ✅ ตรวจสอบ role ว่าเป็น admin
//     if (req.session.user.role !== 'admin') {
//         return res.send('คุณไม่สามารถเข้าหน้านี้ได้');
//     }

//     // ✅ ใช้ req.getConnection ดึงข้อมูลสรุป
//     req.getConnection((err, conn) => {
//         if (err) return res.send('DB connection error');

//         const newReportsQuery = "SELECT COUNT(*) AS count FROM user_reports WHERE status = 'รอดำเนินการ'";
//         const pendingPaymentsQuery = "SELECT COUNT(*) AS count FROM payments WHERE status = 'ค้างชำระ'";
//         const activeContractsQuery = "SELECT COUNT(*) AS count FROM contracts WHERE status = 'active'";
//         const latestReportsQuery = "SELECT u.full_name AS user_name, r.type, r.status, r.created_at " +
//                                    "FROM user_reports r JOIN users u ON r.user_id = u.id " +
//                                    "ORDER BY r.created_at DESC LIMIT 5";

//         // ✅ รัน query พร้อมกัน
//         conn.query(newReportsQuery, (err, newReports) => {
//             if (err) return res.send('DB query error');

//             conn.query(pendingPaymentsQuery, (err, pendingPayments) => {
//                 if (err) return res.send('DB query error');

//                 conn.query(activeContractsQuery, (err, activeContracts) => {
//                     if (err) return res.send('DB query error');

//                     conn.query(latestReportsQuery, (err, latestReports) => {
//                         if (err) return res.send('DB query error');

//                         // ✅ ส่งข้อมูลไปที่ view
//                         res.render('homeList', {
//                             user: req.session.user,
//                             newReportsCount: newReports[0].count,
//                             pendingPaymentsCount: pendingPayments[0].count,
//                             activeContractsCount: activeContracts[0].count,
//                             latestReports
//                         });
//                     });
//                 });
//             });
//         });
//     });
// };