const express=require('express');
const router=express.Router();
const mediaController=require('../controllers/mediaController');

router.get('/media/list', mediaController.show09);

router.get('/media/add', mediaController.add)
router.post('/media/add', mediaController.add09);

router.get('/editmedia/:id',mediaController.edit09);
router.post('/editmedia/:id',mediaController.editPost09);
router.get('/deletemedia/:id',mediaController.delete09);

module.exports = router;
