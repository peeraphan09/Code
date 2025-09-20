// controllers/admin/reportController.js
exports.listReports = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send('DB connection error');

    const sql = `
      SELECT ur.*, u.full_name, r.room_number
      FROM user_reports ur
      JOIN users u ON ur.user_id = u.id
      LEFT JOIN contracts c ON c.user_id = u.id AND c.status != 'ยกเลิก'
      LEFT JOIN rooms r ON c.room_id = r.id
      ORDER BY ur.created_at DESC
    `;

    conn.query(sql, (err, reports) => {
      if (err) return res.send('DB query error');
      res.render('admin/report/report', { reports });
    });
  });
};


exports.acceptReport = (req, res) => {
  const id = req.params.id;

  req.getConnection((err, conn) => {
    if (err) return res.send('DB connection error');

    conn.query('UPDATE user_reports SET status = "in_progress" WHERE id = ?', [id], (err) => {
      if (err) return res.send('DB update error');
      res.redirect('/admin/reports');
    });
  });
};

exports.completeReport = (req, res) => {
  const id = req.params.id;

  req.getConnection((err, conn) => {
    if (err) return res.send('DB connection error');

    conn.query('UPDATE user_reports SET status = "done" WHERE id = ?', [id], (err) => {
      if (err) return res.send('DB update error');
      res.redirect('/admin/reports');
    });
  });
};
