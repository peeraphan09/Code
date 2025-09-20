var pi=3.14;
exports.pi=pi;
var obj={};
obj.updateData=function() {
    console.log("Update Data");
}
obj.deleteData=function() {
    console.log("Delete Data");
}
exports.data=obj;