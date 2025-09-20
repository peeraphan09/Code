const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const session = require('express-session');
const mysql = require('mysql');
const connection = require('express-myconnection');

const app = express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.set('views','views');

app.use(body.urlencoded({ extended: true}));
app.use(cookie());

app.use(session({
    secret:'Password',
    resave: true,
    saveUninitialized: true
}));

const validatorRoute=require('./routes/validator');
app.use('/',validatorRoute);

app.listen('8083');