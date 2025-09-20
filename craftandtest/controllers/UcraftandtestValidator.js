const { check } = require('express-validator');

exports.Ucraftandtest = [
    check('wihtdraw', "เบิกไม่ถูกต้อง!").not().isEmpty().trim(),
    check('status', "สถานะไม่ถูกต้อง!").not().isEmpty().trim(),
    check('completiondate', "วันที่ไม่ถูกต้อง!").not().isEmpty().trim(),
];



