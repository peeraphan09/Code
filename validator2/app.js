const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const session = require('express-session');
const mysql = require('mysql');
const connection = require('express-myconnection');
const app=express();

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
app.use(connection(mysql,{
    host:"localhost",
    user:"pee",
    password:"peeGAME0004",
    port:3306,
    database:"ce"
},'single'));

app.get('/',function(req,res){
    res.render('login',{session: req.session});
});
const validatorRoute=require('./routes/validator');
app.use('/',validatorRoute);

const {check}=require('express-validator');
const {validationResult}=require('express-validator');

app.post('/',[check('username',"กรุณาระบุ Username!").not().isEmpty(),check('password',"กรุณาใส่ Password!").not().isEmpty()],function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.errors=errors;
        req.session.success=false;
        res.render('login',{session: req.session});
    }else{
        const username=req.body.username;
        const password=req.body.password;
        req.getConnection((err,conn) => {
            conn.query('SELECT * from login WHERE username= ? AND password= ?',[username,password],(err,data) =>{
                if(err){
                    res.json(err);
                }else{
                    if(data.length>0) {
                        req.session.userid=data[0].id;
                        res.redirect("/validator/")
                    }else{
                        res.redirect('/');
                    }
                }
            })
        })
    }
});
app.get('/logout',function (req,res) {
    req.session.destroy(function(err){
        res.redirect('/');
    })
});

app.listen('8088');