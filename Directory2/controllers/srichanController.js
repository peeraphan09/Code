const controller ={};
const { validationResult } = require('express-validator');

controller.list=(req,res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT srichan.id as id,srichan.name34 as Name34,t.student28 as Student28,t.telephone28 as Telephone28,p.student09 as Student09 , p.telephone09 as Telephone09 , srichan.Address34 as Address FROM srichan JOIN peeraphan as p on srichan.a34=p.id JOIN theeraphat as t on srichan.b34=t.id ',(err, goob) => {
            res.render('srichanView',{
                data:goob,session:req.session
            });
        });
    });
};  

controller.new = (req, res) => {
    const data = null;
    req.getConnection((err, conn) => {    
        conn.query('SELECT id, student28, telephone28 FROM theeraphat', (err, theeraphat) => {
            conn.query('SELECT id, student09, telephone09 FROM peeraphan', (err, peeraphan) => {
                res.render('srichanForm', {
                    data1:theeraphat,data2:peeraphan,data3:data,session: req.session   
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
        return res.redirect('/srichan/new');
    } else {
        req.session.success = true;
        req.session.topic = "เพิ่มข้อมูลสำเร็จ!";
        const data = req.body;
        const a34 = data.a34;
        const b34 = data.b34;
        const values = [data.name34, a34, b34, data.Address34];
        req.getConnection((err, conn) => {
            conn.query( `INSERT INTO srichan (name34, a34, b34, Address34) VALUES (?, ?, ?, ?)`, values, (err, result) => {

                return res.redirect('/srichan/list');
            }
        );
    });
}};

controller.edit = (req, res) => {
    const {id} = req.params;
        req.getConnection((err, conn) => {
        conn.query('SELECT * FROM srichan WHERE id = ?',[id], (err, no) => {    
            conn.query('SELECT * FROM theeraphat', (err, theeraphatData) => {
                conn.query('SELECT * FROM peeraphan', (err, peeraphanData) => {   
                    res.render('srichanEdit',{
                        data1:theeraphatData,data2:peeraphanData,data3:no,session:req.session
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
            return  res.redirect('/srichan/edit/'+ req.params.id);
        }else{
            req.session.success=true;
            req.session.topic="แก้ไขข้อมูลสำเร็จ!";
            //Database Insert Command
            const {id} = req.params;
            const data = req.body;
            const a34 = data.a34;
            const b34 = data.b34;
                req.getConnection((err, conn) => {
                    conn.query('UPDATE srichan SET name34=?, a34=?, b34=?, Address34=? WHERE id = ?', [data.name34, a34, b34, data.Address34, id], (err, result) => {
                     res.redirect('/srichan/list'); 
        });
    });
}};  

controller.delete=(req,res) => {
    req.session.success=true;
    req.session.topic="ลบข้อมูลสำเร็จ!";
    const {id} = req.params;
    req.getConnection((err,conn) =>{
        conn.query('DELETE FROM srichan WHERE id = ?', [id], (err,ads34) => {
            res.redirect('/srichan/list');
            }
        );
    });
};

module.exports=controller;