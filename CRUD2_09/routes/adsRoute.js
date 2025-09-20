const express = require('express');
const router = express.Router();
const adsController = require('../controllers/adsController');

router.get('/ads/list', adsController.show09);

router.get('/ads/add', adsController.add)
router.post('/ads/add', adsController.add09);

router.get('/editads/:id',adsController.edit09);
router.post('/editads/:id',adsController.editPost09);
router.get('/deleteads/:id',adsController.delete09);

module.exports = router;