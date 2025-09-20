const controller ={};
const { validationResult } = require('express-validator');

controller.list=(req,res) => {
    req.getConnection((err,conn) =>{
        conn.query('SELECT * FROM peeraphan',(err,ce09)=>{
            res.render('peeraphanView',{
                data:ce09,session:req.session
            });
        });
    });
};

controller.new = (req, res) => {
    res.render('peeraphanForm',{
        session:req.session
    });
};

controller.save = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.errors = errors;
        req.session.success = false;
        return res.redirect('/peeraphan/new');
    } else {
        req.session.success = true;
        req.session.topic = "เพิ่มข้อมูลสำเร็จ!";
        const data = req.body;
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO peeraphan SET ?', [data], (err, result) => {
                if (err) {
                    res.json(err);
                }
                return res.redirect('/peeraphan/list');
            });
        });
    }
};


controller.edit = (req, res) => {
    const idToEdit = req.params.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM peeraphan WHERE id = ?', [idToEdit], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.render('peeraphanEdit', { data: data[0],session:req.session });
        });
    });
};

controller.editPost = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.session.errors=errors;
        req.session.success =false;
        return res.redirect('/peeraphan/edit/'+ req.params.id); // เพิ่มคำสั่ง return ที่นี่
    } else {
        req.session.success=true;
        req.session.topic="แก้ไขข้อมูลสำเร็จ!";
        const idToEdit = req.params.id;
        const updatedData = {
            student09: req.body.student09,
            telephone09: req.body.telephone09
        };
        req.getConnection((err, conn) => {
            conn.query('UPDATE peeraphan SET ? WHERE id = ?', [updatedData, idToEdit], (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.redirect('/peeraphan/list');
            });
        });
    }
};


controller.delete=(req,res) => {
    req.session.success=true;
    req.session.topic="ลบข้อมูลสำเร็จ!";
    const idToDelete = req.params.id;
    req.getConnection((err,conn) =>{
        conn.query('DELETE FROM peeraphan WHERE id = ?', [idToDelete], (err,result) => {
            res.redirect('/peeraphan/list');
            }
        );
    });
};

module.exports=controller;