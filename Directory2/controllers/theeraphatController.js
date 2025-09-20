const controller ={};
const { validationResult } = require('express-validator');

controller.list=(req,res) => {
    req.getConnection((err,conn) =>{
        conn.query('SELECT * FROM theeraphat',(err,ce28)=>{
            res.render('theeraphatView',{
                data:ce28,session:req.session
            });
        });
    });
};

controller.new = (req, res) => {
    res.render('theeraphatForm',{
        session:req.session
    });
};

controller.save = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.errors = errors;
        req.session.success = false;
        return res.redirect('/theeraphat/new');
    } else {
        req.session.success = true;
        req.session.topic = "เพิ่มข้อมูลสำเร็จ!";
        const data = req.body;
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO theeraphat SET ?', [data], (err, theeraphatView) => {
                if (err) {
                    res.json(err);
                }
                return res.redirect('/theeraphat/list');
            });
        });
    }
};


controller.edit = (req, res) => {
    const idToEdit = req.params.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM theeraphat WHERE id = ?', [idToEdit], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.render('theeraphatEdit', { data: data[0],session:req.session });
        });
    });
};

controller.editPost = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.session.errors=errors;
        req.session.success =false;
        return res.redirect('/theeraphat/edit/'+ req.params.id); // เพิ่มคำสั่ง return ที่นี่
    } else {
        req.session.success=true;
        req.session.topic="แก้ไขข้อมูลสำเร็จ!";
        const idToEdit = req.params.id;
        const updatedData = {
            student28: req.body.student28,
            telephone28: req.body.telephone28
        };
        req.getConnection((err, conn) => {
            conn.query('UPDATE theeraphat SET ? WHERE id = ?', [updatedData, idToEdit], (err, theeraphatView) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.redirect('/theeraphat/list');
            });
        });
    }
};


controller.delete=(req,res) => {
    req.session.success=true;
    req.session.topic="ลบข้อมูลสำเร็จ!";
    const idToDelete = req.params.id;
    req.getConnection((err,conn) =>{
        conn.query('DELETE FROM theeraphat WHERE id = ?', [idToDelete], (err,result) => {
            res.redirect('/theeraphat/list');
            }
        );
    });
};

module.exports=controller;