const express = require('express');
const router = express.Router();
const controller = require('../Controller/s009');

router.get('/s009', controller.list);

router.get('/s009/add', controller.new); 
router.post('/s009/add', controller.add);

router.post('/s009/delete/:did', controller.delete00);
router.get('/s009/delete/:did', controller.delete);

router.get('/s009/update/:did', controller.edit);
router.post('/s009/update/:did', controller.update);

module.exports = router;
