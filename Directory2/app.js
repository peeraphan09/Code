const express=require('express');
const body=require('body-parser'); 
const cookie=require('cookie-parser');
const session=require('express-session');
const mysql=require('mysql');
const connection=require('express-myconnection');
const app=express();
const path = require('path');
const peeraphan = require('./routes/peeraphanRoute'); 
const boonpun = require('./routes/boonpunRoute'); 
const chanchai = require('./routes/chanchaiRoute'); 
const srichan = require('./routes/srichanRoute'); 
const theeraphat = require('./routes/theeraphatRoute'); 
const saikhamfoo = require('./routes/saikhamfooRoute'); 


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
    user:'group2',
    password:'peeGAME0004',
    port:3306,
    database:'peeraphangroup2'
},'single'));   

app.use('/',peeraphan);
app.use('/',boonpun);

app.use('/',theeraphat);
app.use('/',saikhamfoo);

app.use('/',chanchai);
app.use('/',srichan);

app.listen('8009');