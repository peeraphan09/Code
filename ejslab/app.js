var express=require("express");
var app=express();
app.set("view engine","ejs");
app.get("/:view",function(req,res){
    var data={name:"ABC",age:20};
    res.render("database",{person:req.params.name,user:data});
});
app.listen(8085);