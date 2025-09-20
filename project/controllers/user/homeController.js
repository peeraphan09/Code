exports.homeUS = (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const userId = req.session.user.id;

  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    // นับบิลค้างชำระ
    connection.query(
      `SELECT COUNT(*) AS pendingBillsCount 
       FROM bills b
       JOIN contracts c ON b.contract_id = c.id
       WHERE c.user_id = ? AND b.status = 'ยังไม่ชำระ'`,
      [userId],
      (err, results) => {
        if (err) return res.send('DB query error');

        const pendingBillsCount = results[0].pendingBillsCount || 0;

        // ดึงข้อมูลห้องพัก
        connection.query(
          `SELECT r.* 
           FROM contracts c
           JOIN rooms r ON c.room_id = r.id
           WHERE c.user_id = ? LIMIT 1`,
          [userId],
          (err, rooms) => {
            if (err) return res.send('DB query error');
            const room = rooms[0] || null;

            // ดึงบิลล่าสุด
            connection.query(
              `SELECT b.id, b.bill_month AS month, b.water_amount AS water, 
                      b.electricity_amount AS electricity, 
                      (r.price + b.water_amount + b.electricity_amount) AS total, 
                      b.bill_image
               FROM bills b
               JOIN contracts c ON b.contract_id = c.id
               JOIN rooms r ON c.room_id = r.id
               WHERE c.user_id = ?
               ORDER BY b.bill_month DESC
               LIMIT 5`,
              [userId],
              (err, bills) => {
                if (err) return res.send('DB query error');
                
                res.render('homeUS', {
                  user: req.session.user,
                  room,
                  bills,
                  pendingBillsCount  // ✅ ส่งตัวแปรนี้ไป EJS
                });
              }
            );
          }
        );
      }
    );
  });
};

