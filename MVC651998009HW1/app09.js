var express=require('express');
var app=express();
app.set('view engine','ejs');
app.get('/a009/:x9',function(req,res){
    var d8009={e09:"k009",f09:"l009",g09:"m009"};
    var h8009={i09:"n009",j09:"o009"};
    res.render('apage09',{a09:req.params.x9,d:d8009,h:h8009});   
})
app.get('/b009/:y9',function(req,res){
    var d8009={e09:"k009",f09:"l009",g09:"m009"};
    var h8009={i09:"n009",j09:"o009"};
    var p8009={q09:"r009",s09:"t009"};
    res.render('bpage09',{b09:req.params.y9,d:d8009,h:h8009,p:p8009});   
})
app.get('/a009/:c009/:z9',function(req,res){
    var d8009={e09:"k009",f09:"l009",g09:"m009"};
    var h8009={i09:"n009",j09:"o009"};
    var p8009={q09:"r009",s09:"t009"};
    res.render('cpage09',{c09:req.params.z9,d:d8009,h:h8009,p:p8009});   
})
app.use(function(req,res){
    res.status(404);
    res.render('Error',{error:"Page Not Found"});   
})
app.listen(8009);