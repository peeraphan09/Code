const controller = {};
const { validationResult} = require('express-validator');

controller.list = (req,res) => {
    res.render('validatorList',{session:req.session});
};
controller.new = (req,res) => {

    res.render('validatorForm',{session:req.session});
};
controller.add = (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.session.errors=errors;
        req.session.success=false;
        res.redirect('/validator/new');
    }else{
        req.session.success=true;
        req.session.topic="เพิ่มข้อมูลสำเร็จ";
        res.redirect('/validator');
    };
};
module.exports = controller;