const express=require('express');
const router=express.Router();
const chanchaiController=require('../controllers/chanchaiController');
const Cvalidator = require('../controllers/Cvalidator');

router.get('/chanchai/list',chanchaiController.list);

router.get('/chanchai/new', chanchaiController.new)
router.post('/chanchai/add',Cvalidator.c,chanchaiController.save);

router.get('/chanchai/edit/:id',chanchaiController.edit);
router.post('/chanchai/edit/:id',Cvalidator.chan,chanchaiController.editPost);

router.get('/chanchai/delete/:id',chanchaiController.delete); 

module.exports = router;