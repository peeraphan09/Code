const express = require('express');
const router = express.Router();

const validatorController = require('../controllers/validatorController');
const validator = require('../controllers/validator');

router.get('/validator',validatorController.list);
router.get('/validator/new',validatorController.new);
router.post('/validator/add',validator.addValidator,validatorController.add);
module.exports = router