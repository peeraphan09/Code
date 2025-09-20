const express = require('express');
const router = express.Router();
const controller = require('../Controller/boonpun');

router.get('/boonpun', controller.list);

router.get('/boonpun/add', controller.new); 
router.post('/boonpun/add', controller.add);

router.post('/boonpun/delete/:did', controller.delete00);
router.get('/boonpun/delete/:did', controller.delete);

router.get('/boonpun/update/:did', controller.edit);
router.post('/boonpun/update/:did', controller.update);

module.exports = router;
