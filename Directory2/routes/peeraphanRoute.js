const express=require('express');
const router=express.Router();
const peeraphanController=require('../controllers/peeraphanController');
const validator = require('../controllers/validator');

router.get('/peeraphan/list',peeraphanController.list);

router.get('/peeraphan/new', peeraphanController.new)
router.post('/peeraphan/add',validator.checkch,peeraphanController.save);

router.get('/peeraphan/edit/:id',peeraphanController.edit);
router.post('/peeraphan/edit/:id',validator.cha,peeraphanController.editPost);

router.get('/peeraphan/delete/:id',peeraphanController.delete); 

module.exports = router;