const express = require('express');
const router = express.Router();
const multer = require('multer');
const contractController = require('../../controllers/admin/contractController');

// Multer สำหรับอัพโหลดรูปภาพ
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/contracts/images'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/', contractController.listContracts);
router.get('/add', contractController.addContractForm);
router.post('/add', upload.single('contract_image'), contractController.addContract);

router.get('/edit/:id', contractController.editContractForm);
router.post('/edit/:id', upload.single('contract_image'), contractController.updateContract);

router.get('/delete/:id', contractController.deleteContract);

// PDF
router.get('/pdf/:id', contractController.generateContractPDF);

router.get("/upload-image/:id", contractController.uploadImageForm);

// POST อัพโหลดรูป
router.post("/upload-image/:id", contractController.uploadImage);

router.get("/contracts/pdf/view/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT contract_image FROM contracts WHERE id = ?", [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).send("ไม่พบไฟล์");

    const fileName = results[0].contract_image;
    const filePath = path.join(__dirname, "..", "uploads", fileName); // ✅ ชี้ไปที่ uploads

    res.sendFile(filePath);
  });
});

// ดาวน์โหลด PDF
router.get("/contracts/pdf/download/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT contract_image FROM contracts WHERE id = ?", [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).send("ไม่พบไฟล์");

    const fileName = results[0].contract_image;
    const filePath = path.join(__dirname, "..", "uploads", fileName);

    res.download(filePath);
  });
});

// พิมพ์ PDF (เปิดในแท็บใหม่)
router.get("/contracts/pdf/print/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT contract_image FROM contracts WHERE id = ?", [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).send("ไม่พบไฟล์");

    const fileName = results[0].contract_image;
    const filePath = path.join(__dirname, "..", "uploads", fileName);

    res.setHeader("Content-Type", "application/pdf");
    res.sendFile(filePath);
  });
});
module.exports = router;
