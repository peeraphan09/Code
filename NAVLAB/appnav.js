var express=require('express');
var app=express();
app.set('view engine','ejs');
app.get('/index',function(req,res){
    res.render('index');
    
}); 
app.get('/mirot',function(req,res){
    res.render('mirot');
}); 
app.get('/ce',function(req,res){
    res.render('ce');
});    
app.listen(8081); 