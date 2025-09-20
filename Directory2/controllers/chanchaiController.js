const controller ={};
const { validationResult } = require('express-validator');

controller.list=(req,res) => {
    req.getConnection((err,conn) =>{
        conn.query('SELECT * FROM chanchai',(err,ce34)=>{
            res.render('chanchaiView',{
                data:ce34,session:req.session
            });
        });
    });
};

controller.new = (req, res) => {
    res.render('chanchaiForm',{
        session:req.session
    });
};

controller.save = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       req.session.errors = errors;
        req.session.success = false;
        return res.redirect('/chanchai/new');
    } else {
        req.session.success = true;
        req.session.topic = "เพิ่มข้อมูลสำเร็จ!";
        const data = req.body;
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO chanchai SET ?', [data], (err, chanchaiView) => {
                if (err) {
                    res.json(err);
                }
                return res.redirect('/chanchai/list');
            });
        });
    }
};


controller.edit = (req, res) => {
    const idToEdit = req.params.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM chanchai WHERE id = ?', [idToEdit], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.render('chanchaiEdit', { data: data[0],session:req.session });
        });
    });
};

controller.editPost = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.session.errors=errors;
        req.session.success =false;
        return res.redirect('/chanchai/edit/'+ req.params.id); // เพิ่มคำสั่ง return ที่นี่
    } else {
        req.session.success=true;
        req.session.topic="แก้ไขข้อมูลสำเร็จ!";
        const idToEdit = req.params.id;
        const updatedData = {
            student34: req.body.student34,
            telephone34: req.body.telephone34
        };
        req.getConnection((err, conn) => {
            conn.query('UPDATE chanchai SET ? WHERE id = ?', [updatedData, idToEdit], (err, chanchaiview) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.redirect('/chanchai/list');
            });
        });
    }
};


controller.delete=(req,res) => {
    req.session.success=true;
    req.session.topic="ลบข้อมูลสำเร็จ!";
    const idToDelete = req.params.id;
    req.getConnection((err,conn) =>{
        conn.query('DELETE FROM chanchai WHERE id = ?', [idToDelete], (err,result) => {
            res.redirect('/chanchai/list');
            }
        );
    });
};

module.exports=controller;