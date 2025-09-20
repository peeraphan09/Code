var mysql=require('mysql');
var con=mysql.createConnection({
    host:'localhost',
    user:'nodejs',
    password: 'peeGAME0004',
    database:'ce'
});
con.connect(function(err){
    if(err) throw err;
    console.log('connected!');
});
/*sqlstr="INSERT INTO student (id,firstName,lastName,mobile) values ('59999','ce','mirot','001111')";
con.query(sqlstr,function(err,result){
    if(err) throw err;
    console.log('Insert Complete');
}); */
/*sqlstr="SELECT * FROM student";
con.query(sqlstr, function(err,result){
    if(err) throw err;
    console.log(result);
});*/
/*sqlstr=" delete FROM student WHERE id=1";
con.query(sqlstr, function(err,result){
    if(err) throw err;
    console.log(result);
});*/
sqlstr=" update student set firstname='HH',lastname='II' WHERE id=2";
con.query(sqlstr, function(err,result){
    if(err) throw err;
    console.log(result);
});