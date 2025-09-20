const controller ={};

controller.show09=(req,res) => {
    req.getConnection((err,conn) =>{
        conn.query('SELECT * FROM media09',(err,media09)=>{
            if(err){
                res.status(500).json(err);
                return;
            }
            res.render('mediaView',{
                data:media09
            });
        });
    });
};

controller.add = (req, res) => {
    res.render('addMedia');
};
controller.add09 = (req, res) => {
    const data = req.body; 
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO media09 SET ?', [data], (err, media09) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/media/list');
        });
    });
};
controller.delete09=(req,res) => {
    const idToDelete = req.params.id;
    req.getConnection((err,conn) =>{
        conn.query('DELETE FROM media09 WHERE id = ?', [idToDelete], (err,media09) => {
            res.redirect('/media/list');
            });
        });
    };

controller.edit09 = (req, res) => {
    const idToEdit = req.params.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM media09 WHERE id = ?', [idToEdit], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.render('mediaEdit', { data: data[0] });
        });
    });
};

controller.editPost09 = (req, res) => {
    const idToEdit = req.params.id;
    const updatedData = {
        name: req.body.name,
        price: req.body.price,
    };
    req.getConnection((err, conn) => {
        conn.query('UPDATE media09 SET ? WHERE id = ?', [updatedData, idToEdit], (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.redirect('/media/list'); 
        });
    });
};

module.exports=controller;
