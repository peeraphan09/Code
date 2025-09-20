const express=require('express');
const body=require('body-parser');
const cookie=require('cookie-parser');
const session=require('express-session');
const mysql=require('mysql');
const connection=require('express-myconnection');
const app=express();

app.set('view engine','ejs');
app.use(body());
app.use(cookie());
app.use(session({secret:'Password'}));
app.use(connection(mysql,{
    host:'localhost',
    user:'nodejs',
    password:'peeGAME0004',
    port:3306,
    database:'crud'
},'single'));

const customerRoute=require('./routes/customer');
app.use('/',customerRoute);

app.listen(8001);
    