const controller = {};

controller.show09 = (req,res) => {
    req.getConnection((err,conn) => {
        conn.query('SELECT * FROM boonpun',(err,boonpun)=>{
            if(err) {
                res.json(err);
            }
            res.render('boonpun',{
                data:boonpun
            });
        });
    });
};

controller.add09 = (req,res) => {
    const data=req.body;
    req.getConnection((err,conn) =>{
        conn.query('INSERT INTO boonpun set ?',[data],(err,boonpun)=>{
            if(err){
                res.json(err);
            }
            console.log(boonpun);
            res.redirect('/');
        });
    });
};

module.exports = controller;