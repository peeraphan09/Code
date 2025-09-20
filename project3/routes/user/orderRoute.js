// orderRoute.js
const express = require('express');
const router = express.Router();
const borrowUserController = require('../../controllers/borrowUserController');


// เส้นทางสำหรับดูรายการการยืม
router.get('/orderList', borrowUserController.showOrderList);

// เส้นทางสำหรับยกเลิกคำขอยืม
router.get('/cancelBorrow/:id', borrowUserController.cancelBorrowRequest);

router.post('/confirmPickup/:id', borrowUserController.confirmPickup);

router.post('/confirmReturn/:id', borrowUserController.confirmReturn);

router.get('/history', borrowUserController.showHistory);

router.post('/acknowledgeRejection/:id', borrowUserController.acknowledgeRejection);

router.post('/cancelRequest/:id', borrowUserController.cancelBorrowRequest);

router.get('/cancelRequest/:id', borrowUserController.cancelBorrowRequest);

module.exports = router;
