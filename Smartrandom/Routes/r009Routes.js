const express = require('express');
const router = express.Router();
const controller = require('../Controller/r009');

router.get('/r009', controller.list);

router.get('/r009/add', controller.new); 
router.post('/r009/add', controller.add);

router.post('/r009/delete/:did', controller.delete00);
router.get('/r009/delete/:did', controller.delete);

router.get('/r009/update/:did', controller.edit);
router.post('/r009/update/:did', controller.update);

router.get('/crru09', controller.Dist);

module.exports = router;
