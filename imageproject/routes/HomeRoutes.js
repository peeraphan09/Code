const express = require('express');
const router = express.Router();
const controller = require('../controllers/Home'); 

// router.get('/', controller.list);
router.get('/list', controller.list);
router.get('/', (req, res) => {
    res.render('Home');
});

module.exports = router;