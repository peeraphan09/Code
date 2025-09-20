const express = require('express');
const router = express.Router();
const adminReportController = require('../../controllers/admin/reportController');

// แสดงรายงานทั้งหมด
router.get('/', adminReportController.listReports);

// กดรับเรื่อง (เปลี่ยนเป็น in_progress)
router.post('/accept/:id', adminReportController.acceptReport);

// กดเสร็จสิ้น (เปลี่ยนเป็น done)
router.post('/complete/:id', adminReportController.completeReport);

router.post('/:id/status', (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  req.getConnection((err, conn) => {
    if (err) return res.send('DB connection error');

    conn.query('UPDATE user_reports SET status = ? WHERE id = ?', [status, id], (err) => {
      if (err) return res.send('DB update error');
      res.redirect('/admin/reports');
    });
  });
});
module.exports = router;
