exports.listReports = (req, res) => {
  const userId = req.session.user.id;

  req.getConnection((err, conn) => {
    if (err) return res.send('DB connection error');

    conn.query('SELECT * FROM user_reports WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, reports) => {
      if (err) return res.send('DB query error');
      res.render('user/report/report', { user: req.session.user, reports });
    });
  });
};

exports.addReportView = (req, res) => {
  res.render('user/report/reportAdd', { user: req.session.user });
};

exports.addReport = (req, res) => {
  const { subject, note } = req.body;
  const userId = req.session.user.id;

  req.getConnection((err, conn) => {
    if (err) return res.send('DB connection error');

    conn.query(
      'INSERT INTO user_reports (user_id, subject, note) VALUES (?, ?, ?)',
      [userId, subject, note],
      (err) => {
        if (err) return res.send('DB insert error');
        res.redirect('/user/reports');
      }
    );
  });
};
