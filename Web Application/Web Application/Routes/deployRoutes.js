const express = require('express');
const router = express.Router();
const controller = require('../Controller/deployController');

router.get('/deploy', controller.list);

router.get('/deploy/add', controller.new); 
router.post('/deploy/add', controller.add);

router.post('/deploy/delete/:did', controller.delete00);
router.get('/deploy/delete/:did', controller.delete);

router.get('/deploy/update/:did', controller.edit);
router.post('/deploy/update/:did', controller.update);

router.get('/dist', controller.Dist);

module.exports = router;
