const controller = {};

// ตรวจสอบว่าการรับ req, res ถูกต้องหรือไม่
controller.list = (req, res) => {
    res.render('Home');
}

module.exports = controller;
