const {check}=require('express-validator');

exports.addValidator = 
[check('name',"ชื่อผู้ใช้ไม่ถูกต้อง").not().isEmpty(),
check('email',"อีเมลไม่ถูกต้อง").isEmail()];