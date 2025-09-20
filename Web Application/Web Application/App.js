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
    user:"peeraphan",
    password:'peeGAME0004',
    port:3306,
    database:'iot651998009'
},'single'));


const HomeRoutes = require('./Routes/HomeRoutes');
const DeviceRoutes = require('./Routes/DeviceRoutes');
const siteRoutes = require('./Routes/siteRoutes');
const deployRoutes = require('./Routes/deployRoutes');
// const login = require('./Routes/loginRoute');

// app.use('/', login);
app.use('/',HomeRoutes);
app.use('/',DeviceRoutes);
app.use('/',siteRoutes);
app.use('/',deployRoutes);


app.listen(8091);
