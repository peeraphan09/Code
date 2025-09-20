const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8081;

// ตั้งค่า middleware สำหรับการรับข้อมูลจาก HTTP POST request
app.use(bodyParser.raw({ limit: '10mb', type: 'image/jpeg' }));

// ตั้งค่าเส้นทางสำหรับรับภาพจาก ESP32 CAM
app.post('/upload', (req, res) => {
  // รับข้อมูลภาพจาก request
  const image = req.body;

  // ตรวจสอบว่าโฟลเดอร์ uploads มีอยู่หรือไม่ ถ้าไม่มีให้สร้างขึ้นมา
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // กำหนดชื่อไฟล์ภาพแบบสุ่ม
  const fileName = `image_${Date.now()}.jpg`;
  const filePath = path.join(uploadDir, fileName);

  // เขียนข้อมูลภาพลงในไฟล์
  fs.writeFile(filePath, image, 'binary', (err) => {
    if (err) {
      console.error('Error saving image:', err);
      res.status(500).send('Failed to save image');
    } else {
      console.log('Image saved successfully:', fileName);
      res.status(200).send('Image uploaded successfully');
    }
  });
});

// เริ่มต้นเซิร์ฟเวอร์ที่ PORT ที่กำหนด
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
