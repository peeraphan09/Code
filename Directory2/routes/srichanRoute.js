const express=require('express');
const router=express.Router();
const srichanController=require('../controllers/srichanController');
const Cvalidator = require('../controllers/Cvalidator');

router.get('/srichan/list',srichanController.list);

router.get('/srichan/new',srichanController.new);
router.post('/srichan/add',Cvalidator.check,srichanController.save);

router.get('/srichan/edit/:id', srichanController.edit);
router.post('/srichan/edit/:id',Cvalidator.update,srichanController.update);

router.get('/srichan/delete/:id',srichanController.delete); 

module.exports = router;