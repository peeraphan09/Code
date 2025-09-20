//var response=require("./method.js");
//console.log(response.pi);
//var response=require("./method.js");
//console.log(response.data);
//response.data.deleteData();
//response.data.updateData();
var fs=require("fs");
var readme=fs.readFileSync("code.txt","utf8");
console.log(readme);
fs.writeFileSync("HelloNodeJs.txt",readme);
var fs=require("fs");
fs.mkdir("pee",function(){
    fs.writeFileSync("./pee/readme.txt",readme);
});