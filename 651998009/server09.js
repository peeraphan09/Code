var http=require("http");
var fs=require("fs");
http.createServer(function(req,res){
    if(req.url ==="/peeraphan" || req.url==="/"){
    res.writeHead(200,{"content-type":"text/html"});
    var myStream=fs.createReadStream("./peeraphan.html","utf8");
    myStream.pipe(res);
    }
    else if(req.url==="/boonpun") {
        res.writeHead(200,{"content-type":"text/html"});
    var myStream=fs.createReadStream("./boonpun.html","utf8");
    myStream.pipe(res);
    }
    else if(req.url==="/pee") {
        res.writeHead(200,{"content-type":"text/html"});
    var myStream=fs.createReadStream("./pee.html","utf8");
    myStream.pipe(res);
    }
    else {(req.url==="/ce09") 
        res.writeHead(404,{"content-type":"text/html"});
    var myStream=fs.createReadStream("./ce09.html","utf8");
    myStream.pipe(res);
    }

}).listen(8009,"127.0.0.1");