const express=require('express');
const body=require('body-parser'); 
const cookie=require('cookie-parser');
const session=require('express-session');
const mysql=require('mysql');
const connection=require('express-myconnection');
const app=express();
const path = require('path');
const adsRoute = require('./routes/adsRoute'); 
const mediaRoute = require('./routes/mediaRoute'); 
const personRoute = require('./routes/personRoute');
const prRoute = require('./routes/prRoute');

app.set('view engine','ejs');
app.use(body()); 
app.use(cookie());
app.use(session({secret:'12'}));
app.use(connection(mysql,{
    host:'localhost',
    user:'peeraphan',
    password:'peeGAME0004',
    port:3306,
    database:'crud2_09'
},'single'));   

app.use('/',adsRoute);
app.use('/',mediaRoute);
app.use('/',personRoute);
app.use('/',prRoute);

app.listen('8002');