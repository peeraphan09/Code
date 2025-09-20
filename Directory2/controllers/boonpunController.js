const controller ={};
const { validationResult } = require('express-validator');

controller.list=(req,res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT boonpun.id as id,boonpun.name09 as Name09,t.student28 as Student28,t.telephone28 as Telephone28,c.student34 as Student34 , c.telephone34 as Telephone34 , boonpun.Address09 as Address FROM boonpun JOIN chanchai as c on boonpun.a09=c.id JOIN theeraphat as t on boonpun.b09=t.id ',(err, goob) => {
            res.render('boonpunView',{
                data:goob,session:req.session
            });
        });
    });
};  

controller.new = (req, res) => {
    const data = null;
    req.getConnection((err, conn) => {    
        conn.query('SELECT id, student28, telephone28 FROM theeraphat', (err, theeraphat) => {
            conn.query('SELECT id, student34, telephone34 FROM chanchai', (err, chanchai) => {
                res.render('boonpunForm', {
                    data1:theeraphat,data2:chanchai,data3:data,session: req.session   
                });
            });
        });
    });
};

controller.save = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.errors = errors;
        req.session.success = false;
        return res.redirect('/boonpun/new');
    } else {
        req.session.success = true;
        req.session.topic = "เพิ่มข้อมูลสำเร็จ!";
        const data = req.body;
        const a09 = data.a09;
        const b09 = data.b09;
        const values = [data.name09, a09, b09, data.Address09];
        req.getConnection((err, conn) => {
            conn.query( `INSERT INTO boonpun (name09, a09, b09, Address09) VALUES (?, ?, ?, ?)`, values, (err, result) => {

                return res.redirect('/boonpun/list');
            }
        );
    });
}};

controller.edit = (req, res) => {
    const {id} = req.params;
        req.getConnection((err, conn) => {
        conn.query('SELECT * FROM boonpun WHERE id = ?',[id], (err, no) => {    
            conn.query('SELECT * FROM theeraphat', (err, theeraphatData) => {
                conn.query('SELECT * FROM chanchai', (err, chanchaiData) => {   
                    res.render('boonpunEdit',{
                        data1:theeraphatData,data2:chanchaiData,data3:no,session:req.session
                        });
                    });
                });
            });
        });
    };

    
controller.update = (req, res) => {
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            req.session.errors=errors;
            req.session.success =false;
            return  res.redirect('/boonpun/edit/'+ req.params.id);
        }else{
            req.session.success=true;
            req.session.topic="แก้ไขข้อมูลสำเร็จ!";
            //Database Insert Command
            const {id} = req.params;
            const data = req.body;
            const a09 = data.a09;
            const b09 = data.b09;
                req.getConnection((err, conn) => {
                    conn.query('UPDATE boonpun SET name09=?, a09=?, b09=?, Address09=? WHERE id = ?', [data.name09, a09, b09, data.Address09, id], (err, result) => {
                     res.redirect('/boonpun/list'); 
        });
    });
}};  

controller.delete=(req,res) => {
    req.session.success=true;
    req.session.topic="ลบข้อมูลสำเร็จ!";
    const {id} = req.params;
    req.getConnection((err,conn) =>{
        conn.query('DELETE FROM boonpun WHERE id = ?', [id], (err,ads09) => {
            res.redirect('/boonpun/list');
            }
        );
    });
};

module.exports=controller;