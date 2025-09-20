const express = require('express');
const router = express.Router();
const controller = require('../Controller/peeraphan');

router.get('/peeraphan', controller.list);

router.get('/peeraphan/add', controller.new); 
router.post('/peeraphan/add', controller.add);

router.post('/peeraphan/delete/:did', controller.delete00);
router.get('/peeraphan/delete/:did', controller.delete);

router.get('/peeraphan/update/:did', controller.edit);
router.post('/peeraphan/update/:did', controller.update);

router.get('/iot09', controller.Dist);

module.exports = router;
