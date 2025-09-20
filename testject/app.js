const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mysql = require('mysql');
const connection = require('express-myconnection');
const multer = require('multer'); // เพิ่มการ import multer module ที่นี่
const path = require('path'); // เพิ่มการ import path module ที่นี่

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'Password',
    resave: true,
    saveUninitialized: true
}));
app.use(connection(mysql, {
    host: 'localhost',
    user: "peeraphan",
    password: 'peeGAME0004',
    port: 3306,
    database: 'testpro'
}, 'single'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// กำหนดการอัปโหลดภาพ
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.includes('image')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
}).single('imageFile');


app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html'));
});

// รับข้อมูลภาพจาก esp32-cam และแสดงบนหน้าเว็บ
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            const fileName = req.file.filename;
            const filePath = `uploads/${fileName}`;
            res.render('uploaded', { filePath: filePath }); // ส่งข้อมูลไฟล์ที่อัปโหลดไปยังหน้าเว็บ uploaded.ejs
        }
    });
});

app.listen(8090, () => {
    console.log('Server is running on port 8090');
});
