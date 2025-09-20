// controllers/admin/billController.js
exports.listBills = (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    connection.query('SELECT * FROM bills ORDER BY created_at DESC', (err, bills) => {
      if (err) return res.send('DB query error: ' + err);

      res.render('admin/bill/BillList', { bills });
    });
  });
};

exports.addBillForm = (req, res) => {
  res.render('admin/bill/billAdd'); // หน้า form เพิ่มบิล
};

exports.addBill = (req, res) => {
  const { water_amount, electricity_amount } = req.body;

  const billData = {
    water_amount: parseFloat(water_amount) || 0,
    electricity_amount: parseFloat(electricity_amount) || 0,
    total_amount: (parseFloat(water_amount) || 0) + (parseFloat(electricity_amount) || 0),
  };

  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    connection.query('INSERT INTO bills SET ?', billData, (err) => {
      if (err) return res.send('DB insert error: ' + err);
      res.redirect('/admin/bills');
    });
  });
};

exports.deleteBill = (req, res) => {
  const { id } = req.params;

  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    connection.query('DELETE FROM bills WHERE id = ?', [id], (err) => {
      if (err) return res.send('DB delete error: ' + err);
      res.redirect('/admin/bills');
    });
  });
};
exports.editBillForm = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    if (err) return res.send("DB connection error");
    conn.query("SELECT * FROM bills WHERE id = ?", [id], (err, results) => {
      if (err) return res.send("DB query error");
      if (results.length === 0) return res.send("Bill not found");
      res.render("admin/bill/billEdit", { bill: results[0] });
    });
  });
};

// แก้ไขบิล
exports.updateBill = (req, res) => {
  const { id } = req.params;
  const { water_amount, electricity_amount } = req.body;
  const updateData = {
    water_amount: parseFloat(water_amount) || 0,
    electricity_amount: parseFloat(electricity_amount) || 0,
    total_amount: (parseFloat(water_amount) || 0) + (parseFloat(electricity_amount) || 0),
  };

  req.getConnection((err, conn) => {
    if (err) return res.send("DB connection error");
    conn.query("UPDATE bills SET ? WHERE id = ?", [updateData, id], (err) => {
      if (err) return res.send("DB update error");
      res.redirect("/admin/bills");
    });
  });
};