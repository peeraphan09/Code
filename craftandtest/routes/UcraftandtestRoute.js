const express=require('express');
const router=express.Router();
const UcraftandtestController=require('../controllers/UcraftandtestController');
const validator = require('../controllers/UcraftandtestValidator');
// const isAuthenticated = require('../controllers/isAuthenticated');



router.get('/Ucraftandtest/list',UcraftandtestController.show);

router.get('/Ucraftandtest/add', UcraftandtestController.add);
router.post('/Ucraftandtest/add', validator.Ucraftandtest, UcraftandtestController.new);

router.get('/Ucraftandtest/edit/:id', UcraftandtestController.edit);

router.post('/Ucraftandtest/edit/:id', validator.Ucraftandtest, UcraftandtestController.save);


router.get('/Ucraftandtest/delete/:id', UcraftandtestController.delete);
router.post('/Ucraftandtest/delete/:id',UcraftandtestController.delete00);



// router.get('/Ucraftandtest/list', isAuthenticated, UcraftandtestController.list);
// router.get('/Ucraftandtest/show', isAuthenticated, UcraftandtestController.show);






module.exports = router;