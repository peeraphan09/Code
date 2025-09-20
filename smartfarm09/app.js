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
    database:'smartfarm09'
},'single'));


const HomeRoutes = require('./Routes/HomeRoutes');
const boonpunRoutes = require('./Routes/boonpunRoutes');
// const siteRoutes = require('./Routes/siteRoutes');
const peeraphanRoutes = require('./Routes/peeraphanRoutes');
// const login = require('./Routes/loginRoute');

// app.use('/', login);
app.use('/',HomeRoutes);
app.use('/',boonpunRoutes);
// app.use('/',siteRoutes);
app.use('/',peeraphanRoutes);


app.listen(8009);
