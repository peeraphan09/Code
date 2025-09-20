const express = require('express');
const router = express.Router();
const controller = require('../Controller/t009');

router.get('/t009', controller.list);

router.get('/t009/add', controller.new); 
router.post('/t009/add', controller.add);

router.post('/t009/delete/:did', controller.delete00);
router.get('/t009/delete/:did', controller.delete);

router.get('/t009/update/:did', controller.edit);
router.post('/t009/update/:did', controller.update);

module.exports = router;
