const {check} = require('express-validator');

exports.addValidator=[check('name',"ชื่อไม่ถูกต้อง!").not().isEmpty(),check('email',"อีเมล์ไม่ถูกต้อง!").isEmail()];