// controllers/admin/contractController.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// =============================
// PATH
// =============================
const pdfDir = path.join(__dirname, '../../public/uploads/contracts');
const imageDir = path.join(__dirname, '../../public/uploads/contracts/images');
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

const thaiFontPath = path.join(__dirname, '../../public/fonts/THSarabun.ttf');

const statusMap = {
  active: 'กำลังดำเนินการ',
  ended: 'เสร็จสิ้น',
  cancelled: 'ยกเลิก'
};

// =============================
// LIST Contracts
// =============================
exports.listContracts = (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    const sqlContracts = `
      SELECT c.*, u.full_name, r.room_number
      FROM contracts c
      JOIN users u ON c.user_id = u.id
      JOIN rooms r ON c.room_id = r.id
      ORDER BY c.created_at DESC
    `;

  const sqlSummary = `
  SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN c.status = 'เสร็จสิ้น' THEN 1 ELSE 0 END) as success,
    SUM(CASE WHEN c.status = 'ยังไม่เพิ่มสัญญาเช่า' THEN 1 ELSE 0 END) as pending
  FROM contracts c
`;


    connection.query(sqlContracts, (err, contracts) => {
      if (err) return res.send('DB query error: ' + err);

      contracts.forEach(r => {
        r.status_th = statusMap[r.status] || r.status;
        r.image_path = r.image_path || null;
      });

      connection.query(sqlSummary, (err, summary) => {
    if (err) return res.send('DB summary error: ' + err);

    const { total, success, pending } = summary[0];

    res.render('admin/contract/contractList', {
        contracts,
        totalContracts: total,
        successContracts: success,
        pendingContracts: pending
    });
    });
    });
  });
};

// =============================
// ADD Contract
// =============================
exports.addContractForm = (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    // ดึงเฉพาะห้องที่มีผู้เช่า พร้อมเรียงตามหมายเลขห้อง
    const sql = `
      SELECT r.id, r.room_number, r.price, u.full_name AS user_full_name, u.id AS user_id
      FROM rooms r
      INNER JOIN users u ON r.user_id = u.id
      ORDER BY r.room_number ASC
    `;

    connection.query(sql, (err, rooms) => {
      if (err) return res.send('DB query error (rooms)');
      res.render('admin/contract/contractAdd', { rooms });
    });
  });
};



exports.addContract = (req, res) => {
  const { user_id, room_id } = req.body; // รับแค่ user_id และ room_id

  let contract_image = null;
  if (req.file) {
    contract_image = `/uploads/contracts/images/${req.file.filename}`;
  }

  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    const contractData = {
      user_id,
      room_id,
      status: 'ยังไม่เพิ่มสัญญาเช่า',
      contract_image
    };

    connection.query('INSERT INTO contracts SET ?', contractData, (err) => {
      if (err) return res.send('DB insert error: ' + err);
      res.redirect('/admin/contracts');
    });
  });
};




// =============================
// EDIT Contract
// =============================
exports.editContractForm = (req, res) => {
  const { id } = req.params;

  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    connection.query('SELECT * FROM contracts WHERE id = ?', [id], (err, contracts) => {
      if (err) return res.send('DB query error');

      connection.query('SELECT id, full_name FROM users', (err, users) => {
        if (err) return res.send('DB query error');

        connection.query('SELECT id, room_number, price FROM rooms', (err, rooms) => {
          if (err) return res.send('DB query error');
          res.render('admin/contract/contractEdit', { contract: contracts[0], users, rooms });
        });
      });
    });
  });
};

exports.updateContract = (req, res) => {
  const { id } = req.params;
  const { user_id, room_id, start_date, end_date, rent_price, deposit, status } = req.body;
  let updateData = { user_id, room_id, start_date, end_date, rent_price, deposit, status };

  if (req.file) {
    updateData.contract_image = `/uploads/contracts/images/${req.file.filename}`;
  }

  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    connection.query(
      'UPDATE contracts SET ? WHERE id=?',
      [updateData, id],
      (err) => {
        if (err) return res.send('DB update error');
        res.redirect('/admin/contracts');
      }
    );
  });
};

// =============================
// DELETE Contract
// =============================
exports.deleteContract = (req, res) => {
  const { id } = req.params;

  req.getConnection((err, connection) => {
    if (err) return res.send('DB connection error');

    connection.query('DELETE FROM contracts WHERE id=?', [id], (err) => {
      if (err) return res.send('DB delete error');
      res.redirect('/admin/contracts');
    });
  });
};

// =============================
// PDF Generate + Download
// =============================
exports.generateContractPDF = (req, res) => {
  const contractId = req.params.id;

  req.getConnection((err, connection) => {
    connection.query(
      `SELECT c.*, u.full_name, r.room_number, r.price
       FROM contracts c
       JOIN users u ON c.user_id = u.id
       JOIN rooms r ON c.room_id = r.id
       WHERE c.id = ?`,
      [contractId],
      (err, results) => {
        if (err || results.length === 0) return res.send('Contract not found');
        const contract = results[0];

        const fileName = `contract_${contract.id}.pdf`;
        const filePath = path.join(pdfDir, fileName);
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        if (fs.existsSync(thaiFontPath)) doc.font(thaiFontPath);

        doc.fontSize(20).text('สัญญาเช่า', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14)
          .text(`ผู้เช่า: ${contract.full_name}`)
          .text(`ห้อง: ${contract.room_number}`)
          .text(`ค่าเช่า: ${contract.price} บาท`)
          .text(`เงินมัดจำ: ${contract.deposit} บาท`)
          .text(`เริ่ม: ${contract.start_date.toISOString().split('T')[0]}`)
          .text(`สิ้นสุด: ${contract.end_date.toISOString().split('T')[0]}`)
          .text(`สถานะ: ${statusMap[contract.status] || contract.status}`);

        doc.end();
        writeStream.on('finish', () => res.download(filePath, fileName));
      }
    );
  });
};
// แสดงหน้า upload image
exports.uploadImageForm = (req, res) => {
  const { id } = req.params;
  res.render("admin/contract/uploadImage", { contractId: id });
};

// รับค่าจาก form (ใช้ multer สำหรับ upload)
const multer = require("multer");

// ตั้งค่า storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/contracts/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage }).single("contract_image");

// อัพโหลดรูป
exports.uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.send("Error uploading file.");
    const { id } = req.params;
    const filename = req.file.filename;

    req.getConnection((error, conn) => {
      if (error) return res.send("DB error");

     conn.query(
        "UPDATE contracts SET contract_image = ?, status = ? WHERE id = ?",
        [filename, 'บันทึกสัญญาเรียบร้อยแล้ว', id],
        (err2) => {
            if (err2) return res.send("Update DB failed");
            res.redirect("/admin/contracts");
        }
      );

    });
  });
};

