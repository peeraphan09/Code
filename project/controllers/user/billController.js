const path = require('path');
const fs = require('fs');

exports.listUserBills = (req, res) => {
  const userId = req.session.userId; // user id จาก session

  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    const sql = `
      SELECT 
        b.id AS bill_id,
        b.bill_month,
        r.price AS rent_amount,
        b.water_amount,
        b.electricity_units,
        b.electricity_amount,
        b.total_amount,
        b.status,
        b.bill_image
      FROM bills b
      JOIN contracts c ON b.contract_id = c.id
      JOIN rooms r ON c.room_id = r.id
      WHERE c.user_id = ? AND b.visible_to_user = 1
      ORDER BY b.bill_month DESC
    `;

    connection.query(sql, [userId], (err, bills) => {
      if (err) return res.send('DB query error: ' + err);
      res.render('user/bills/bills', { bills });
    });
  });
};

// ดูรูป PNG บิล
exports.viewBillImage = (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;

  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    connection.query(`
      SELECT b.bill_image
      FROM bills b
      JOIN contracts c ON b.contract_id = c.id
      WHERE b.id = ? AND c.user_id = ? AND b.visible_to_user = 1
    `, [id, userId], (err, results) => {
      if (err || results.length === 0) return res.send('Bill not found');

      const billImage = results[0].bill_image;
      if (!billImage) return res.send('ยังไม่มีรูปบิล');

      const imagePath = path.join(__dirname, '../../../public/uploads/bills', billImage);
      if (!fs.existsSync(imagePath)) return res.send('ไม่พบไฟล์รูป');

      res.sendFile(imagePath);
    });
  });
};

// ดาวน์โหลด PNG บิล
exports.downloadBillImage = (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;

  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    connection.query(`
      SELECT b.bill_image
      FROM bills b
      JOIN contracts c ON b.contract_id = c.id
      WHERE b.id = ? AND c.user_id = ? AND b.visible_to_user = 1
    `, [id, userId], (err, results) => {
      if (err || results.length === 0) return res.send('Bill not found');

      const billImage = results[0].bill_image;
      if (!billImage) return res.send('ยังไม่มีรูปบิล');

      const imagePath = path.join(__dirname, '../../../public/uploads/bills', billImage);
      if (!fs.existsSync(imagePath)) return res.send('ไม่พบไฟล์รูป');

      res.download(imagePath);
    });
  });
};
