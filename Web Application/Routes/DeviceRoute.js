const express = require('express');
const router = express.Router();
const controller = require('../Controller/DeviceControllers');

router.get('/device', controller.list);

router.get('/device/add', controller.new); 
router.post('/device/add', controller.add);

router.post('/device/delete/:did', controller.delete00);
router.get('/device/delete/:did', controller.delete);

router.get('/device/update/:did', controller.edit);
router.post('/device/update/:did', controller.update);

module.exports = router;
