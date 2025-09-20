const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mysql = require('mysql'); // ตรวจสอบว่ามีการ import mysql
const connection = require('express-myconnection'); // ตรวจสอบว่ามีการ import express-myconnection
const path = require('path');
const app = express();
const port = 3001;

// Middleware to serve static files from the 'images' directory
// app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/images', express.static(path.join(__dirname, 'public/images'), {
  maxAge: 0, // หรือกำหนดเวลาตามความเหมาะสม เช่น '1d' สำหรับ 1 วัน
}));

app.use(express.json()); 
// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'Password', // เปลี่ยนเป็นคีย์ที่ปลอดภัย
    resave: false,
    saveUninitialized: true
}));

// MySQL connection setup
app.use(connection(mysql, {
    host: 'localhost',
    user: 'peeraphan',
    password: 'peeGAME0004',
    port: 3306,
    database: 'imagespro', // เปลี่ยนเป็นชื่อฐานข้อมูลของคุณ
    timezone: 'utc'
}, 'single'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route setup
const imageRoutes = require('./routes/imageRoutes');
app.use('/', imageRoutes);

const HomeRoutes = require('./routes/HomeRoutes');
app.use('/', HomeRoutes);

app.get('/home', (req, res) => {
  res.render('Home'); // ตรวจสอบให้แน่ใจว่าชื่อไฟล์ 'Home.ejs' ถูกต้องในโฟลเดอร์ views
});


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



























//โค๊ดต้นแบบ
// const express = require('express');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const session = require('express-session');
// const mysql = require('mysql');
// const connection = require('express-myconnection');
// const path = require('path');
// const app = express();
// const port = 3001;

// // Middleware to serve static files from the 'images' directory
// app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use('/css', express.static(path.join(__dirname, 'public/css')));

// // Middleware setup
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(session({
//     secret: 'Password', // เปลี่ยนเป็นคีย์ที่ปลอดภัย
//     resave: false,
//     saveUninitialized: true
// }));

// // MySQL connection setup
// app.use(connection(mysql, {
//     host: 'localhost',
//     user: 'peeraphan',
//     password: 'peeGAME0004',
//     port: 3306,
//     database: 'imagespro', // เปลี่ยนเป็นชื่อฐานข้อมูลของคุณ
//     timezone: 'utc'
// }, 'single'));

// // Set view engine
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Route setup
// const imageRoutes = require('./routes/imageRoutes');
// app.use('/', imageRoutes);

// const HomeRoutes = require('./routes/HomeRoutes');
// app.use('/',HomeRoutes);

// // Start server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

// const express = require('express');
// const body=require('body-parser'); 
// const cookie=require('cookie-parser');
// const session=require('express-session');
// const mysql=require('mysql');
// const connection=require('express-myconnection');
// const path = require('path');
// const app = express();
// const port = 3001;

// // Middleware to serve static files from the 'images' directory
// app.use('/images', express.static(path.join(__dirname, 'images')));

// // Set view engine
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Route setup
// const imageRoutes = require('./routes/imageRoutes');
// app.use('/', imageRoutes);

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
