const express = require('express');
const router = express.Router();
const controller = require('../Controller/Home'); 

router.get('/', controller.list);

module.exports = router;