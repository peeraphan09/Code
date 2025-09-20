const express = require('express');
const router = express.Router();

const boonpunController = require('../controllers/boonpunController');

router.get('/',boonpunController.show09);
router.post('/add',boonpunController.add09);

module.exports = router;