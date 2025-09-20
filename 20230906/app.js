var express=require('express');
var app=express();
var body=require('body-parser')
app.use(body());
var cookie=require('cookie-parser');
var session=require('express-session');
app.use(session({secret:'cecrru'}));
app.set('view engine','ejs');
/*app.get('/:name',function(req,res){
    res.render('profile',{person:req.params.name});
}); 
app.get('/studentForm',function(req,res){
    res.render('studentForm');
});
app.post('/studentData',function(req,res){
    data={
        fname:req.body.fname,
        lname:req.body.lname
    }
    console.log(data);
    res.render("studentShow",{student:data});
});    
app.get('/teacherForm',function(req,res){
    res.render('teacherForm');
});    
app.post('/teacherData',function(req,res){
    data={
        name:req.body.name,
        mobile:req.body.mobile,
        age:req.body.age
    }
    console.log(data);
    res.render("teacherShow",{teacher:data});
});  */ 
/*app.get('/createCookie',function(req,res){
    res.cookie('myCookie','CE CRRU');
    res.end('Create Cookie');
});  */
/*app.get('/delCookie',function(req,res){
    res.cookie('myCookie');
    res.end('Delete Cookie');
});    */
app.get('/getCookie',(req,res)=>{
    res.send(req.cookies);
});     
app.get('/',function(req,res){
    req.session.name="MIROT";
    res.end('Session Name :'+req.session.name);
});     
app.get('/session',function(req,res){
    res.end('Session Name :'+req.session.name);
});    
app.listen(8081);    

