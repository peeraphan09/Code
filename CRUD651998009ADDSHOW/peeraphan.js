const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const session = require('express-session');
const mysql = require('mysql');
const connection = require('express-myconnection');
const app = express();


app.set('view engine', 'ejs');

app.use(body());
app.use(cookie());
app.use(session({secret:'PasswOrd'}));
app.use(connection(mysql,{
    host: 'localhost',
    user: 'student09',
    password: 'peeGAME0004',
    port: 3306,
    database: 'pee09'
},'single'));

// IMPORT ROUTES
const boonpunRoute = require('./routes/boonpunRoute');
app.use('/',boonpunRoute);

app.listen('8009');