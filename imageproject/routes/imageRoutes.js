// routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.get('/images', imageController.listImages);
router.post('/images/delete', imageController.deleteImage);

module.exports = router;
