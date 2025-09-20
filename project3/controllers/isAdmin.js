function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.redirect('/login'); // หรือสามารถแสดงข้อความ "ไม่อนุญาต" ได้
}
