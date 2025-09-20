const { check } = require('express-validator');

exports.c = [
    check('student34', "ชื่อไม่ถูกต้อง!").not().isEmpty(),
    check('telephone34', "โทรศัพท์ไม่ถูกต้อง!").isInt(),
];

exports.chan = [
    check('student34', "ชื่อไม่ถูกต้อง!").not().isEmpty(),
    check('telephone34', "โทรศัพท์ไม่ถูกต้อง!").isInt(),
]; 

exports.check = [
    check('name34', "ชื่อไม่ถูกต้อง!").not().isEmpty(),
    check('a34', "Student09 ไม่ถูกต้อง!").isInt(),
    check('b34', "Student28 ไม่ถูกต้อง!").isInt(),
    check('Address34', "ที่อยู่ไม่ถูกต้อง!").not().isEmpty(),
];

exports.update = [
    check('name34', "ชื่อไม่ถูกต้อง!").not().isEmpty(),
    check('a34', "Student09 ไม่ถูกต้อง!").isInt(),
    check('b34', "Student28 ไม่ถูกต้อง!").isInt(),
    check('Address34', "ที่อยู่ไม่ถูกต้อง!").not().isEmpty(),
];

