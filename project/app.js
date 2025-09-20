const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mysql = require('mysql');
const connection = require('express-myconnection');
const path = require('path');

const app = express();

// Static & Views
app.use('/uploads', express.static('public/uploads'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); 
// หรือเฉพาะ uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: 'Password', 
    resave: true,
    saveUninitialized: true
  })
);

// MySQL Connection
app.use(
  connection(mysql, {
    host: 'localhost',
    user: 'peeraphan',
    password: 'peeGAME0004',
    port: 3306,
    database: 'dormitory1',
    timezone: 'utc'
  }, 'single')
);

const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes); 

const adminRoutes = require('./routes/adminRoutes');
app.use('/', adminRoutes); 

const adminUserRoutes = require('./routes/admin/user');
app.use('/admin/user', adminUserRoutes);
  // note: singular "user"

const roomRoutes = require('./routes/admin/roomRoutes');
app.use('/admin/rooms', roomRoutes);

const adminContractRoutes = require('./routes/admin/contractRoutes');
app.use('/admin/contracts', adminContractRoutes);

// const billRoutes = require('./routes/admin/billRoutes');
// app.use('/admin/bills', billRoutes);

const homeUserRoutes = require('./routes/user/homeRoutes');
app.use('/homeUS', homeUserRoutes);

const payRoutes = require('./routes/admin/pay');
app.use('/admin/payments', payRoutes);

const homeRoutes = require('./routes/home');
app.use('/', homeRoutes);


//user
const userContractRoutes = require('./routes/user/contractRoutes');
app.use('/user/contracts', userContractRoutes);

const billRoutes = require('./routes/user/billRoutes');
app.use('/user/bills', billRoutes);


const adminReportRouter = require('./routes/admin/adminReportRoutes');
app.use('/admin/reports', adminReportRouter);

const userReportRouter = require('./routes/user/userReportRoutes');
app.use('/user/reports', userReportRouter);
app.listen(8029, () => {
    console.log('Server running on http://localhost:8029');
});
