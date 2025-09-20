const express = require('express');
const router = express.Router();
const controller = require('../Controller/siteController');

router.get('/site', controller.list);

router.get('/site/add', controller.new); 
router.post('/site/add', controller.add);

router.post('/site/delete/:sid', controller.delete00);
router.get('/site/delete/:sid', controller.delete);

router.get('/site/update/:sid', controller.edit);
router.post('/site/update/:sid', controller.update);

module.exports = router;
