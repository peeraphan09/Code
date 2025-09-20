const express = require('express');
const router = express.Router();
const contractController = require('../../controllers/user/contractController');

// หน้าแสดงสัญญาของ user
router.get('/', contractController.myContracts);
router.get('/sign/:id', contractController.signContractView);
router.post('/sign/:id', contractController.saveSignature);

module.exports = router;
