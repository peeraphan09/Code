const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mysql = require('mysql');
const connection = require('express-myconnection');
const { check, validationResult } = require('express-validator');
const app = express();
const path = require('path'); 

app.use('/uploads', express.static('public/uploads'));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: 'Password', 
    resave: true,
    saveUninitialized: true
  })
);

app.use(
  connection(mysql, {
    host: 'localhost',
    user: 'peeraphan',
    password: 'peeGAME0004',
    port: 3306,
    database: 'project3',
    timezone:'utc'
  }, 'single')
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // ทำให้ทุกหน้าสามารถเข้าถึง user ได้
  next();
});


// เพิ่ม Route สำหรับหน้า login และ register
const authRoute = require('./routes/authRoutes');  // เชื่อมต่อไฟล์ Route ของคุณ
app.use('/', authRoute); 

const homeRoute = require('./routes/homeRoute');
app.use('/home', homeRoute);

const userRoutes = require('./routes/admin/userRoutes'); // นำเข้า userRoutes
app.use('/', userRoutes);

const adminRoute = require('./routes/admin/equipment'); // นำเข้า userRoutes
app.use('/admin', adminRoute);

const equipmentRoute = require('./routes/user/equipmentRoute'); // นำเข้า userRoutes
app.use('/', equipmentRoute); // ใช้ /user เป็น prefix

// app.get('/home', (req, res) => {
//     res.render('homeList', {
//       title: 'เมนูสำหรับแอดมิน'
//     });
//   });

const borrowRoutes = require('./routes/user/borrow');  // นำเข้า borrow.js
app.use('/user', borrowRoutes);  // ✅ ใช้ app ไม่ใช่ router

const equipmentRouter = require('./routes/user/equipmentRoute');
app.use('/users', equipmentRouter);

const borrowAdminRoute = require('./routes/admin/borrowAdminRoute');  // นำเข้า borrowAdminRoute.js
app.use('/admin', borrowAdminRoute);

const orderRoute = require('./routes/user/orderRoute');  // ตรวจสอบเส้นทางให้ถูกต้อง
app.use('/user', orderRoute);  // ใช้ router ที่กำหนดไว้
 // ตั้งค่าเส้นทาง

 const dash = require('./routes/authRoutes');
 app.use('/admin', dash);

 app.use('/user', require('./routes/user/profile'));

 app.use('/admin', require('./routes/admin/adminprofile'));
 app.use('/users', require('./routes/user/orderRoute'));


  app.use('/admin', require('./routes/admin/adminprofile'));
 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(8029);


// <!-- <div class="dropdown-divider"></div>
//                 <a class="dropdown-item" href="#">Separated link</a>
//               </div> -->