const path = require('path');
const multer = require('multer');

// ตั้งค่า multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/rooms'); // เก็บไฟล์ไว้ที่นี่
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // เปลี่ยนชื่อไฟล์ไม่ให้ซ้ำ
  }
});
const upload = multer({ storage });

// --- LIST ROOMS ---
exports.listRooms = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.status(500).send(err);

    const sql = `
      SELECT r.*, u.full_name AS tenant_name
      FROM rooms r
      LEFT JOIN users u ON r.user_id = u.id
    `;

    conn.query(sql, (err, rooms) => {
      if (err) return res.status(500).send(err);
      res.render('admin/room/roomList', { rooms });
    });
  });
};

// --- ADD ROOM FORM ---
exports.addRoomForm = (req, res) => {
  res.render('admin/room/roomAdd');
};

// --- ADD ROOM ---
exports.addRoom = (req, res) => {
  const { room_number, type, price } = req.body;
  const image = req.file ? `/uploads/rooms/${req.file.filename}` : null;

  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    const roomData = { room_number, type, price, status: 'ว่าง', image };
    connection.query('INSERT INTO rooms SET ?', roomData, (err) => {
      if (err) return res.send('DB insert error');
      res.redirect('/admin/rooms');
    });
  });
};

// --- DELETE ROOM ---
exports.deleteRoom = (req, res) => {
  const roomId = req.params.id;
  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    connection.query('DELETE FROM rooms WHERE id = ?', [roomId], (err) => {
      if (err) return res.send('DB delete error');
      res.redirect('/admin/rooms');
    });
  });
};

// --- EDIT ROOM FORM ---
exports.editRoomForm = (req, res) => {
  const roomId = req.params.id;
  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    connection.query('SELECT * FROM rooms WHERE id = ?', [roomId], (err, results) => {
      if (err) return res.send('DB query error');
      const room = results[0];

      connection.query('SELECT id, full_name FROM users', (err, users) => {
        if (err) return res.send('DB query error users');

        res.render('admin/room/roomEdit', { room, users });
      });
    });
  });
};

// --- UPDATE ROOM ---
exports.updateRoom = (req, res) => {
  const roomId = req.params.id;
  const { room_number, type, status, price, user_id, oldImage } = req.body;
  const image = req.file ? `/uploads/rooms/${req.file.filename}` : oldImage;

  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    connection.query(
      'UPDATE rooms SET room_number = ?, type = ?, status = ?, price = ?, user_id = ?, image = ? WHERE id = ?',
      [room_number, type, status, price, user_id || null, image, roomId],
      (err) => {
        if (err) return res.send('DB update error');
        res.redirect('/admin/rooms');
      }
    );
  });
};

// export multer middleware
exports.upload = upload;
