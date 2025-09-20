const express=require('express');
const router=express.Router();
const boonpunController=require('../controllers/boonpunController');
const validator = require('../controllers/validator');

router.get('/boonpun/list',boonpunController.list);

router.get('/boonpun/new',boonpunController.new);
router.post('/boonpun/add',validator.checkkh,boonpunController.save);

router.get('/boonpun/edit/:id', boonpunController.edit);
router.post('/boonpun/edit/:id',validator.kha,boonpunController.update);

router.get('/boonpun/delete/:id',boonpunController.delete); 

module.exports = router;