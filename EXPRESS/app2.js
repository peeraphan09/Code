var express=require("express");
var app=express();
app.set("view engine","ejs");
app.get("/:name",function(req,res){
    var data={name:"AAA BBB",age:18,job:"Programmer"};
    res.render("profile",{person:req.params.name,user:data});
});
app.listen(8081);