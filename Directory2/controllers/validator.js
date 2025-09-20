const { check } = require('express-validator');

exports.checkch = [
    check('student09', "ชื่อไม่ถูกต้อง!").not().isEmpty(),
    check('telephone09', "โทรศัพท์ไม่ถูกต้อง!").not().isEmpty(),
];

exports.cha = [
    check('student09', "ชื่อไม่ถูกต้อง!").not().isEmpty(),
    check('telephone09', "โทรศัพท์ไม่ถูกต้อง!").not().isEmpty(),
]; 

exports.checkkh = [
    check('name09', "ชื่อไม่ถูกต้อง!").not().isEmpty(),
    check('a09', "Student34 ไม่ถูกต้อง!").isInt(),
    check('b09', "Student28 ไม่ถูกต้อง!").isInt(),
    check('Address09', "ที่อยู่ไม่ถูกต้อง!").not().isEmpty(),
];

exports.kha = [
    check('name09', "ชื่อไม่ถูกต้อง!").not().isEmpty(),
    check('a09', "Student34 ไม่ถูกต้อง!").isInt(),
    check('b09', "Student28 ไม่ถูกต้อง!").isInt(),
    check('Address09', "ที่อยู่ไม่ถูกต้อง!").not().isEmpty(),
];

