// controllers/user/contractController.js
exports.myContracts = (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const userId = req.session.user.id;

  req.getConnection((err, conn) => {
    if (err) return res.send('DB connection error');

    const sql = `
      SELECT c.*, r.room_number, r.price
      FROM contracts c
      LEFT JOIN rooms r ON c.room_id = r.id
      WHERE c.user_id = ?
      ORDER BY c.id DESC
    `;

    conn.query(sql, [userId], (err, contracts) => {
      if (err) return res.send('DB query error contracts');

      res.render('user/contracts', { user: req.session.user, contracts });
    });
  });
};

exports.signContractView = (req, res) => {
  const contractId = req.params.id;
  req.getConnection((err, conn) => {
    if (err) return res.send('DB connection error');
    conn.query('SELECT * FROM contracts WHERE id = ?', [contractId], (err, results) => {
      if (err) return res.send('DB query error');
      if (results.length === 0) return res.send('ไม่พบสัญญา');
      res.render('user/contractSign', { contract: results[0] });
    });
  });
};

exports.saveSignature = (req, res) => {
  const contractId = req.params.id;
  const signatureData = req.body.signature.replace(/^data:image\/png;base64,/, '');
  const fs = require('fs');
  const path = `uploads/contracts/sign_${contractId}.png`;

  fs.writeFile(path, signatureData, 'base64', (err) => {
    if (err) return res.json({ success: false, error: err });
    
    req.getConnection((err, conn) => {
      if (err) return res.json({ success: false, error: err });
      conn.query('UPDATE contracts SET signature_image = ? WHERE id = ?', [path.split('/').pop(), contractId], (err) => {
        if (err) return res.json({ success: false, error: err });
        res.json({ success: true });
      });
    });
  });
};

