const controller ={};

controller.show09=(req,res) => {
    req.getConnection((err,conn) =>{
        conn.query('SELECT * FROM person09',(err,person09)=>{
            if(err){
                res.status(500).json(err);
                return;
            }
            res.render('personView',{
                data:person09
            });
        });
    });
};

controller.add = (req, res) => {
    res.render('addPerson');
};
controller.add09 = (req, res) => {
    const data = req.body; 
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO person09 SET ?', [data], (err, person09) => {
            res.redirect('/person/list');
        });
    });
};

controller.delete09=(req,res) => {
    const idToDelete = req.params.id;
    req.getConnection((err,conn) =>{
        conn.query('DELETE FROM person09 WHERE id = ?', [idToDelete], (err,person09) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.redirect('/person/list');
            });
        });
    };
controller.edit09 = (req, res) => {
    const idToEdit = req.params.id;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM person09 WHERE id = ?', [idToEdit], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.render('personEdit', { data: data[0] });
        });
    });
};
controller.editPost09 = (req, res) => {
    const idToEdit = req.params.id;
    const updatedData = {
        name: req.body.name,
        mobile: req.body.mobile,
    };
    req.getConnection((err, conn) => {
        conn.query('UPDATE person09 SET ? WHERE id = ?', [updatedData, idToEdit], (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.redirect('/person/list'); 
        });
    });
};

module.exports=controller;
