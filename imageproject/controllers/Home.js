// const controller = {};

// // ตรวจสอบว่าการรับ req, res ถูกต้องหรือไม่
// controller.list = (req, res) => {
//     res.render('Home');
// }

// module.exports = controller;

const controller = {};

// ฟังก์ชันเพื่อแสดงหน้า Home
controller.list = (req, res) => {
    req.getConnection((err, db) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Database connection error');
        }

        db.query('SELECT * FROM images ORDER BY id DESC', (error, results) => {
            if (error) {
                console.error('Database query error:', error);
                return res.status(500).send('Database query error');
            }

            // ส่งข้อมูลรูปภาพไปยังมุมมอง List.ejs
            res.render('List', { images: results });
        });
    });
};

module.exports = controller;
