const express = require('express');
const router = express.Router();
const borrowRequestController = require('../../controllers/borrowRequestController');  // ใช้ controller ที่สร้างขึ้น
const connection = require('express-myconnection');

// หน้าอนุมัติคำขอ
router.get('/adminApproveRequests', borrowRequestController.approveRequest);

// การอนุมัติหรือปฏิเสธคำขอ
router.post('/approveRequest/:id', borrowRequestController.updateRequestStatus);

router.post('/approveRequest/:id', async (req, res) => {
    const requestId = req.params.id;
    const action = req.body.action;

    try {
        if (action === 'approve') {
            // อนุมัติ: set status = Approved, pickup_status = not_picked_up
            await db.query(`
                UPDATE borrow_requests
                SET status = 'Approved', pickup_status = 'not_picked_up'
                WHERE id = ?
            `, [requestId]);
        } else if (action === 'reject') {
            // ปฏิเสธ: set status = Rejected
            await db.query(`
                UPDATE borrow_requests
                SET status = 'Rejected'
                WHERE id = ?
            `, [requestId]);
        }
        res.redirect('/admin/allRequests');
    } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).send('เกิดข้อผิดพลาด');
    }
});
router.post('/confirmReturn/:id', (req, res) => {
    
});






module.exports = router;


