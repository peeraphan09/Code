const controller ={};

controller.show09=(req,res) => {
    req.getConnection((err,conn) =>{
        conn.query('SELECT * FROM ads09',(err,ads09)=>{
            if(err){
                res.status(500).json(err);
                return;
            }
            res.render('adsView',{
                data:ads09
            });
        });
    });
};

controller.add = (req, res) => {
    res.render('addAds');
};
controller.add09=(req,res) => {
    const data=req.body;
    req.getConnection((err,conn) =>{
        conn.query('INSERT INTO ads09 set ?',[data],(err,ads09)=>{
            if(err){
                res.json(err);
            }
            res.redirect('/ads/list');
        })
    })
};

controller.delete09=(req,res) => {
    const idToDelete = req.params.id;
    req.getConnection((err,conn) =>{
        conn.query('DELETE FROM ads09 WHERE id = ?', [idToDelete], (err,ads09) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.redirect('/ads/list');
            });
        });
    };
    controller.edit09 = (req, res) => {
    const idToEdit = req.params.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM ads09 WHERE id = ?', [idToEdit], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.render('adsEdit', { data: data[0] });
        });
    });
};
controller.editPost09 = (req, res) => {
    const idToEdit = req.params.id;
    const updatedData = {
        name: req.body.name,
        detail: req.body.detail,
    };
    req.getConnection((err, conn) => {
        conn.query('UPDATE ads09 SET ? WHERE id = ?', [updatedData, idToEdit], (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.redirect('/ads/list'); 
        });
    });
};

module.exports=controller;