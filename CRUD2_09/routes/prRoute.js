const express=require('express');
const router=express.Router();
const prController=require('../controllers/prController');

router.get('/pr', prController.list);

router.get('/pr/new',prController.new);
router.post('/pr/add',prController.save);

router.get('/pr/update/:id',prController.edit);
router.post('/pr/update/:id',prController.update);

router.get('/pr/delete/:id',prController.delete);

module.exports = router;