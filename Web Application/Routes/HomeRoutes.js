const express = require('express');
const router = express.Router();
const controller = require('../Controller/HomeController'); 

router.get('/', controller.list);

module.exports = router;