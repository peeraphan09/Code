const controller ={};
const { validationResult } = require('express-validator');


// const isAuthenticated = (req, res, next) => {
//     if (!req.session.userid) {
//         return res.redirect('/'); // หากไม่มีการเข้าสู่ระบบให้ redirect ไปยังหน้าหลัก
//     }
//     next();
// };


// controller.list = (req,res) => {
//     if (typeof req.session.userid == 'undefined') {res.redirect('/'); }else{
   
//     res.render('craftandtestList2',{session: req.session});
// }

// };

controller.show = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM craftandtest', (err, allcraftandtests) => {
            // if (typeof req.session.userid == 'undefined')
            if (err) {
                res.status(500).json(err);
                return;
            }

            // กรองข้อมูลเฉพาะสถานที่บริจาคของผู้ใช้ที่เข้าสู่ระบบ
            const usercraftandtests = allcraftandtests.filter(place => place.userid === req.session.userid);

            res.render('UcraftandtestList', {
                data: usercraftandtests,
                session: req.session
            });
        });
    });
};


controller.add = (req, res) => {
    res.render('UcraftandtestAdd', {
        session: req.session,
        data: {} // สร้างตัวแปร data เปล่าเพื่อให้ไม่เกิดข้อผิดพลาด data is not defined
    });
};


controller.new = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.session.errors=errors;
        req.session.success =false;
        return  res.redirect('/Ucraftandtest/add')
    }else{
        req.session.success=true;
        req.session.topic="เพิ่มข้อมูลสำเร็จ!";
        const data = req.body; 
        req.getConnection((err, conn) => {
        conn.query('INSERT INTO craftandtest SET ?', [data], (err, craftandtest) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/Ucraftandtest/list');
        });
    });
}};

controller.delete = (req, res) => {
    const data = req.body.data;
    res.render('confirmUcraftandtestEdit', {
        data: data,session: req.session
    });
};

controller.delete00 = (req, res) => {
    const idToDelete = req.params.id; // รับค่า id จากพารามิเตอร์ของ URL
    req.session.success = true;
    req.session.topic = "ลบข้อมูลสำเร็จ!";
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM craftandtest WHERE id = ?', [idToDelete], (err, craftandtest) => {
            res.redirect('/Ucraftandtest/list');
        });
    });
};




controller.edit = (req, res) => {
    const idToEdit = req.params.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM craftandtest WHERE id = ?', [idToEdit], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.render('UcraftandtestEdit', { data: data[0],session:req.session });
        });
    });
};

controller.save = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.session.errors=errors;
        req.session.success =false;
        return  res.redirect('/Ucraftandtest/save/'+ req.params.id)
    }else{
        req.session.success=true;
        req.session.topic="แก้ไขข้อมูลสำเร็จ!";
        const idToEdit = req.params.id;
        const updatedData = {
        wihtdraw: req.body.wihtdraw,
        status: req.body.status,
        completiondate: req.body.completiondate,
        

    };
    req.getConnection((err, conn) => {
        conn.query('UPDATE craftandtest SET ? WHERE id = ?', [updatedData, idToEdit], (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.redirect('/Ucraftandtest/list'); 
        });
    });
}};











module.exports=controller;
