const express=require('express');
const router=express.Router();
const saikhamfooController=require('../controllers/saikhamfooController');
const Tvalidator = require('../controllers/Tvalidator');

router.get('/saikhamfoo/list',saikhamfooController.list);

router.get('/saikhamfoo/new',saikhamfooController.new);
router.post('/saikhamfoo/add',Tvalidator.check,saikhamfooController.save);

router.get('/saikhamfoo/edit/:id', saikhamfooController.edit);
router.post('/saikhamfoo/edit/:id',Tvalidator.update,saikhamfooController.update);

router.get('/saikhamfoo/delete/:id',saikhamfooController.delete); 

module.exports = router;