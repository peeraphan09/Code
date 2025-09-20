var express=require("express");
var routing=express();
routing.get("/",function(req,res){
    res.send("<h1> Hello world </h1>");
});
routing.get("/lab1/",function(req,res){
    //console.log("Require :"+new Date()+req.method,req.url)
    res.send("<h1> LAB 1 </h1>"+req.params.name);
});
routing.get("/lab1/:id",function(req,res){
    res.send("<h1> LAB ID : params.id </h1>"+req.params.id);
});
routing.get("/lab1/:id/:name",function(req,res){
    res.send("<h1> Name ID: params.name (params.id)</h1>"+req.params.name +" ( "+req.params.id +" )");
});
routing.get("/lab1/:dep/:zone/:area",function(req,res){
    res.send("<h1> ZONE : params.area / params.zone / params.dep </h1>"+req.params.area+" / "+req.params.zone+" / "+req.params.dep);
});routing.listen(8081);