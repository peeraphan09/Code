//var buf=new Buffer(200);
//buf.write("CE SCIT CRRU ")
//console.log(buf.toString());  

/*var buf=new Buffer(26);
for (var i=0; i< 26; i++) {
    buf[i] =i+97;
}
console.log(buf.toString());*/

var buf1=new Buffer("Chiangrai");
var buf2=new Buffer("MIROT");
var buf3=Buffer.concat([buf1,buf2]);
console.log(buf3.toString());