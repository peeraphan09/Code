const express=require('express');
const router=express.Router();
const personController=require('../controllers/personController');

router.get('/person/list', personController.show09);

router.get('/person/add', personController.add);
router.post('/person/add', personController.add09);

router.get('/editperson/:id',personController.edit09);
router.post('/editperson/:id',personController.editPost09);
router.get('/deleteperson/:id',personController.delete09);

module.exports = router;