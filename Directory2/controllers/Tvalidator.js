const { check } = require('express-validator');

exports.t = [
    check('student28', "ชื่อไม่ถูกต้อง!").not().isEmpty(),
    check('telephone28', "โทรศัพท์ไม่ถูกต้อง!").isInt(),
];

exports.thee = [
    check('student28', "ชื่อไม่ถูกต้อง!").not().isEmpty(),
    check('telephone28', "โทรศัพท์ไม่ถูกต้อง!").isInt(),
]; 

exports.check = [
    check('name28', "ชื่อไม่ถูกต้อง!").not().isEmpty(),
    check('a28', "Student09 ไม่ถูกต้อง!").isInt(),
    check('b28', "Student34 ไม่ถูกต้อง!").isInt(),
    check('Address28', "ที่อยู่ไม่ถูกต้อง!").not().isEmpty(),
];

exports.update = [
    check('name28', "ชื่อไม่ถูกต้อง!").not().isEmpty(),
    check('a28', "Student09 ไม่ถูกต้อง!").isInt(),
    check('b28', "Student34 ไม่ถูกต้อง!").isInt(),
    check('Address28', "ที่อยู่ไม่ถูกต้อง!").not().isEmpty(),
];

