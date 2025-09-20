const controller ={};
const { validationResult } = require('express-validator');

controller.list=(req,res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT saikhamfoo.id as id,saikhamfoo.name28 as Name28,p.student09 as Student09,p.telephone09 as Telephone09,c.student34 as Student34 , c.telephone34 as Telephone34 , saikhamfoo.Address28 as Address FROM saikhamfoo JOIN chanchai as c on saikhamfoo.b28=c.id JOIN peeraphan as p on saikhamfoo.a28=p.id ',(err, goob) => {
            res.render('saikhamfooView',{
                data:goob,session:req.session
            });
        });
    });
};  

controller.new = (req, res) => {
    const data = null;
    req.getConnection((err, conn) => {    
        conn.query('SELECT id, student09, telephone09 FROM peeraphan', (err, peeraphan) => {
            conn.query('SELECT id, student34, telephone34 FROM chanchai', (err, chanchai) => {
                res.render('saikhamfooForm', {
                    data1:peeraphan,data2:chanchai,data3:data,session: req.session   
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
        return res.redirect('/saikhamfoo/new');
    } else {
        req.session.success = true;
        req.session.topic = "เพิ่มข้อมูลสำเร็จ!";
        const data = req.body;
        const a28 = data.a28;
        const b28 = data.b28;
        const values = [data.name28, a28, b28, data.Address28];
        req.getConnection((err, conn) => {
            conn.query( `INSERT INTO saikhamfoo (name28, a28, b28, Address28) VALUES (?, ?, ?, ?)`, values, (err, result) => {

                return res.redirect('/saikhamfoo/list');
            }
        );
    });
}};

controller.edit = (req, res) => {
    const {id} = req.params;
        req.getConnection((err, conn) => {
        conn.query('SELECT * FROM saikhamfoo WHERE id = ?',[id], (err, no) => {    
            conn.query('SELECT * FROM peeraphan', (err, peeraphanData) => {
                conn.query('SELECT * FROM chanchai', (err, chanchaiData) => {   
                    res.render('saikhamfooEdit',{
                        data1:peeraphanData,data2:chanchaiData,data3:no,session:req.session
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
            return  res.redirect('/saikhamfoo/edit/'+ req.params.id);
        }else{
            req.session.success=true;
            req.session.topic="แก้ไขข้อมูลสำเร็จ!";
            //Database Insert Command
            const {id} = req.params;
            const data = req.body;
            const a28 = data.a28;
            const b28 = data.b28;
                req.getConnection((err, conn) => {
                    conn.query('UPDATE saikhamfoo SET name28=?, a28=?, b28=?, Address28=? WHERE id = ?', [data.name28, a28, b28, data.Address28, id], (err, result) => {
                     res.redirect('/saikhamfoo/list'); 
        });
    });
}};  

controller.delete=(req,res) => {
    req.session.success=true;
    req.session.topic="ลบข้อมูลสำเร็จ!";
    const {id} = req.params;
    req.getConnection((err,conn) =>{
        conn.query('DELETE FROM saikhamfoo WHERE id = ?', [id], (err,ads28) => {
            res.redirect('/saikhamfoo/list');
            }
        );
    });
};

module.exports=controller;