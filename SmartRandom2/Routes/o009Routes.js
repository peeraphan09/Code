const express = require('express');
const router = express.Router();
const controller = require('../Controller/o009');

router.get('/o009', controller.list);

router.get('/o009/add', controller.new); 
router.post('/o009/add', controller.add);

router.post('/o009/delete/:did', controller.delete00);
router.get('/o009/delete/:did', controller.delete);

router.get('/o009/update/:did', controller.edit);
router.post('/o009/update/:did', controller.update);

router.get('/iot09', controller.Dist);

module.exports = router;
