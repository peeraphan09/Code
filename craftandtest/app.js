const express=require('express');
const body=require('body-parser'); 
const cookie=require('cookie-parser');
const session=require('express-session');
const mysql=require('mysql');
const connection=require('express-myconnection');
const app=express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(body.urlencoded({extended: true})); 
app.use(cookie());
app.use(session({
    secret:'12',
    resave:true,
    saveUninitialized: true
}));

app.use(connection(mysql,{
    host:'localhost',
    user:'peeraphan',
    password:'peeGAME0004',
    port:'3306',
    database:'ce_gift_for_you'
},'single'));   


const UcraftandtestRoute = require('./routes/UcraftandtestRoute');
app.use('/', UcraftandtestRoute); // ตรวจสอบว่าเส้นทางถูกต้องและตรงกับที่คุณต้องการใช้งาน

app.listen('8033');