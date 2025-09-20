const express=require('express');
const body=require('body-parser'); 
const cookie=require('cookie-parser');
const session=require('express-session');
const mysql=require('mysql');
const connection=require('express-myconnection');
const app=express();

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(body.urlencoded({extended:true}));
app.use(cookie());
app.use(session({
    secret:'Password',
    resave:true,
    saveUninitialized:true
}));
app.use(connection(mysql,{ 
    host:'localhost',
    user:"ketmanee",
    password:'1560101556156',
    port:3306,
    database:'iot651998021'
},'single'));


const HomeRoutes = require('./Routes/HomeRoutes');
app.use('/',HomeRoutes);
const DeviceRoute = require('./Routes/DeviceRoute');
app.use('/',DeviceRoute);
const siteRoutes = require('./Routes/siteRoutes');
app.use('/',siteRoutes);
const deployRoutes = require('./Routes/deployRoutes');
app.use('/',deployRoutes);


app.listen(8021);
