const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/profile');
const multer = require('multer');
const path = require('path');

// กำหนด storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// เส้นทางสำหรับโปรไฟล์
router.get('/profile', profileController.getProfile); // 🟢 /user/profile
router.post('/profile', upload.single('profile_image'), function (req, res) {
  req.getConnection((err, connection) => {
    if (err) return res.status(500).send('DB connection error');
    req.db = connection;
    profileController.updateProfile(req, res);
  });
});


module.exports = router;
