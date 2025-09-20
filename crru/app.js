var express=require("express");
var app=express();
app.set("view engine","ejs");
app.get("/ce/:scit",function(req,res){
    var Data1 ={name:"scit"};
    var Data2 ={name:"crru",Address:"ABCDE",id:"20"};
    var Data3={name:"teacher",id:5,name1:"XYZ",phone:"0812345678"};
    res.render("mirot",{scit:req.params.scit,user1:Data1,user2:Data2,user3:Data3});
});
app.listen(8009);