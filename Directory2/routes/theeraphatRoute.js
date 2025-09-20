const express=require('express');
const router=express.Router();
const theeraphatController=require('../controllers/theeraphatController');
const Tvalidator = require('../controllers/Tvalidator');

router.get('/theeraphat/list',theeraphatController.list);

router.get('/theeraphat/new', theeraphatController.new)
router.post('/theeraphat/add',Tvalidator.t,theeraphatController.save);

router.get('/theeraphat/edit/:id',theeraphatController.edit);
router.post('/theeraphat/edit/:id',Tvalidator.thee,theeraphatController.editPost);

router.get('/theeraphat/delete/:id',theeraphatController.delete); 

module.exports = router;