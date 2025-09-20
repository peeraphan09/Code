/*var http=require("http");
http.createServer(function(req,res){
    res.writeHead(200,{"content-type":"text/plain"});
    res.end("HelloWorld");
}).listen(8081,"127.0.0.1")*/ 

/*var http=require("http");
var fs=require("fs");
http.createServer(function(req,res){
    res.writeHead(200,{"content-type":"text/html"});
    var myStream=fs.createReadStream("./index.html","utf8");
    myStream.pipe(res);
}).listen(8081,"127.0.0.1"); */

/*var http=require("http");
var fs=require("fs");
var myuser={
    "name":"CE",
    "job":"Web",
    "age":80
}
http.createServer(function(req,res){
    res.writeHead(200,{"content-type":"application/JSON"});
    res.end(JSON.stringify(myuser));
}).listen(8081,"127.0.0.1");*/ 

var http=require("http");
var fs=require("fs");
http.createServer(function(req,res){
    if(req.url ==="/home" || req.url==="/"){
    res.writeHead(200,{"content-type":"text/html"});
    var myStream=fs.createReadStream("./index.html","utf8");
    myStream.pipe(res);
    }
    else if(req.url==="/page1") {
        res.writeHead(200,{"content-type":"text/html"});
    var myStream=fs.createReadStream("./page1.html","utf8");
    myStream.pipe(res);
    }
    else if(req.url==="/page2") {
        res.writeHead(200,{"content-type":"text/html"});
    var myStream=fs.createReadStream("./page2.html","utf8");
    myStream.pipe(res);
    }
    else {(req.url==="/error") 
        res.writeHead(404,{"content-type":"text/html"});
    var myStream=fs.createReadStream("./error.html","utf8");
    myStream.pipe(res);
    }
}).listen(8081,"127.0.0.1");