const express = require('express');
const router = express.Router();
const controller = require('../Controller/q009');

router.get('/q009', controller.list);

router.get('/q009/add', controller.new); 
router.post('/q009/add', controller.add);

router.post('/q009/delete/:did', controller.delete00);
router.get('/q009/delete/:did', controller.delete);

router.get('/q009/update/:did', controller.edit);
router.post('/q009/update/:did', controller.update);

module.exports = router;
