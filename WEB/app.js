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
app.use(
    connection(mysql, {
      host: 'localhost',
      user: 'peeraphan',
      password: 'peeGAME0004',
      port: 3306,
      database: 'iot651998009',
      timezone:'utc'
    }, 'single')
  );

const DeviceRoute=require('./routes/Device');
app.use('/',DeviceRoute);

app.listen(8001);
    