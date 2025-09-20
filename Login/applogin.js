var express=require('express');
var app=express();
var body=require('body-parser')
app.use(body());
var session=require('express-session');
app.use(session({secret:'cecrru'}));
app.set('view engine','ejs');

app.get('/',function(req,res){
    res.render('loginForm');
}); 
app.post('/login',function(req,res){
    if(req.body.username=='ce' && req.body.password == 'mirot'){
      req.session.user=req.body.username;
      res.end('LOGIN OK');
    }else {
        res.end('LOGIN ERROR')
    }     
});  
app.get('/home',function(req,res){
    if(req.session.user){ res.end('OK');
}else {  res.end('ERROR'); }
});
app.get('/logout',function(req,res){
    req.session.destroy();
    res.render('loginform');
});    
app.listen(8081);