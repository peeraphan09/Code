const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

exports.listPayments = (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    const sql = `
      SELECT 
        b.id AS bill_id,
        r.room_number,
        u.full_name,
        b.bill_month,
        r.price AS rent_amount,
        b.water_amount,
        b.electricity_units,
        b.electricity_amount,
        (r.price + b.water_amount + b.electricity_amount) AS total_amount,
        b.status,
        b.bill_image
      FROM bills b
      JOIN contracts c ON b.contract_id = c.id
      JOIN rooms r ON c.room_id = r.id
      JOIN users u ON c.user_id = u.id
      ORDER BY b.bill_month DESC;
    `;

    connection.query(sql, (err, bills) => {
      if (err) return res.send('DB query error: ' + err);
      res.render('admin/pay/paymentList', { bills });
    });
  });
};

exports.addPaymentForm = (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    connection.query(`
      SELECT c.id, r.room_number, r.price, u.full_name
      FROM contracts c
      JOIN rooms r ON c.room_id = r.id
      JOIN users u ON c.user_id = u.id
    `, (err, contracts) => {
      if (err) return res.send('DB query error: ' + err);
      res.render('admin/pay/paymentAdd', { contracts });
    });
  });
};

exports.addPayment = (req, res) => {
  const { contract_id, bill_month, water_amount, electricity_units } = req.body;
  const electricity_amount = electricity_units * 7; // คำนวณตามหน่วยละ 7 บาท

  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    const sql = `
      INSERT INTO bills (contract_id, bill_month, water_amount, electricity_units, electricity_amount)
      VALUES (?, ?, ?, ?, ?)
    `;
    connection.query(sql, [contract_id, bill_month, water_amount, electricity_units, electricity_amount], (err) => {
      if (err) return res.send('DB insert error: ' + err);
      res.redirect('/admin/payments');
    });
  });
};

exports.editPaymentForm = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    connection.query('SELECT * FROM bills WHERE id = ?', [id], (err, bills) => {
      if (err) return res.send('DB query error: ' + err);
      const bill = bills[0];

      connection.query(`
        SELECT c.id, r.room_number, r.price, u.full_name
        FROM contracts c
        JOIN rooms r ON c.room_id = r.id
        JOIN users u ON c.user_id = u.id
      `, (err, contracts) => {
        if (err) return res.send('DB query error: ' + err);
        res.render('admin/pay/paymentEdit', { bill, contracts });
      });
    });
  });
};

exports.updatePayment = (req, res) => {
  const { id } = req.params;
  const { contract_id, bill_month, water_amount, electricity_units } = req.body;
  const electricity_amount = electricity_units * 7;

  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    const sql = `
      UPDATE bills
      SET contract_id = ?, bill_month = ?, water_amount = ?, electricity_units = ?, electricity_amount = ?
      WHERE id = ?
    `;
    connection.query(sql, [contract_id, bill_month, water_amount, electricity_units, electricity_amount, id], (err) => {
      if (err) return res.send('DB update error: ' + err);
      res.redirect('/admin/payments');
    });
  });
};

exports.deletePayment = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');
    connection.query('DELETE FROM bills WHERE id = ?', [id], (err) => {
      if (err) return res.send('DB delete error: ' + err);
      res.redirect('/admin/payments');
    });
  });
};

exports.sendToUser = async (req, res) => {
  const { id } = req.params;

  req.getConnection(async (err, connection) => {
    if (err) return res.send('DB connection error');

    // ดึงข้อมูลบิล
    connection.query(
      `SELECT b.*, r.room_number, u.full_name, r.price AS rent_amount,
              (r.price + b.water_amount + b.electricity_amount) AS total_amount,
              c.user_id
       FROM bills b
       JOIN contracts c ON b.contract_id = c.id
       JOIN rooms r ON c.room_id = r.id
       JOIN users u ON c.user_id = u.id
       WHERE b.id = ?`,
      [id],
      async (err, results) => {
        if (err || results.length === 0) return res.send('Bill not found');

        const bill = results[0];

        // ✅ HTML ของบิล
        const billHtml = `
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #000; padding: 8px; text-align: center; }
              th { background: #f0f0f0; }
            </style>
          </head>
          <body>
            <h2>ใบแจ้งชำระเงิน</h2>
            <p>ผู้เช่า: ${bill.full_name}</p>
            <p>ห้อง: ${bill.room_number}</p>
            <p>เดือน: ${bill.bill_month}</p>
            <table>
              <thead>
                <tr>
                  <th>ค่าเช่า</th>
                  <th>ค่าน้ำ</th>
                  <th>ค่าไฟ</th>
                  <th>รวม</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${bill.rent_amount.toFixed(2)}</td>
                  <td>${bill.water_amount.toFixed(2)}</td>
                  <td>${bill.electricity_amount.toFixed(2)}</td>
                  <td>${bill.total_amount.toFixed(2)}</td>
                  <td>${bill.status}</td>
                </tr>
              </tbody>
            </table>
          </body>
          </html>
        `;

        try {
          // ✅ gen PNG ด้วย puppeteer
          const browser = await puppeteer.launch({ headless: true });
          const page = await browser.newPage();
          await page.setContent(billHtml, { waitUntil: 'networkidle0' });

          // ใช้ process.cwd() เพื่อให้ path ชี้ไป root project
          const uploadDir = path.join(process.cwd(), 'public/uploads/bills');
          if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

          const fileName = `bill_${bill.id}.png`;
          const filePath = path.join(uploadDir, fileName);

          await page.screenshot({ path: filePath, fullPage: true });
          await browser.close();

          console.log("✅ PNG saved at:", filePath);

          // ✅ update DB: เก็บชื่อไฟล์ + total + visible_to_user=1
          connection.query(
            `UPDATE bills 
             SET bill_image = ?, total_amount = ?, visible_to_user = 1 
             WHERE id = ?`,
            [fileName, bill.total_amount, bill.id],
            (err) => {
              if (err) return res.send('DB update error: ' + err);

              // ✅ กลับไปหน้า admin
              res.redirect('/admin/payments');
            }
          );
        } catch (err) {
          return res.send('Error generating PNG: ' + err);
        }
      }
    );
  });
};


// ดูรูปบิล
exports.viewBillImage = (req, res) => {
  const { id } = req.params;

  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    connection.query('SELECT bill_image FROM bills WHERE id = ?', [id], (err, results) => {
      if (err || results.length === 0) return res.send('Bill not found');

      const billFile = results[0].bill_image;
      if (!billFile) return res.send('ยังไม่มีรูปบิล');

      const imagePath = path.join(__dirname, '../../public', billFile);
      if (!fs.existsSync(imagePath)) return res.send('ไม่พบไฟล์รูป');

      res.sendFile(imagePath);
    });
  });
};

// ดาวน์โหลดรูปบิล
exports.downloadBillImage = (req, res) => {
  const { id } = req.params;

  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    connection.query('SELECT bill_image FROM bills WHERE id = ?', [id], (err, results) => {
      if (err || results.length === 0) return res.send('Bill not found');

      const billFile = results[0].bill_image;
      if (!billFile) return res.send('ยังไม่มีรูปบิล');

      const imagePath = path.join(__dirname, '../../public', billFile);
      if (!fs.existsSync(imagePath)) return res.send('ไม่พบไฟล์รูป');

      res.download(imagePath);
    });
  });
};
