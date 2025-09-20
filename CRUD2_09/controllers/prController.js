const controller ={};

controller.list=(req,res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT pr.id,pr.start,media09.name as media_name,ads09.name as ads_name,person09.name as person_name FROM pr JOIN media09 on pr.mid=media09.id JOIN ads09 on pr.aid=ads09.id JOIN person09 on pr.pid=person09.id',(err, prs) => {
            if (err) {
                res.json(err);
            }
            res.render('prs',{
                data:prs
            });
        });
    });
};        

/*controller.new=(req,res) => {
    res.render('prForm');
};*/

controller.new=(req,res) => {
    const data = null;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM media09', (err, media) => {
            conn.query('SELECT * FROM ads09', (err, ads) => {
                conn.query('SELECT * FROM person09', (err, person) => {
                    res.render('prForm',{
                    data1:media,data2:ads,data3:person,data4:data
                    });
                });
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body; 
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO pr SET ?', [data], (err, prs) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/pr');
        });
    });
};

controller.edit = (req, res) => {
    const {id} = req.params; 
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM media09', (err, mediaView) => {
                conn.query('SELECT * FROM ads09', (err, adsView) => {
                    conn.query('SELECT * FROM person09', (err, personView) => {
                        conn.query('SELECT * FROM pr WHERE id = ?',[id], (err, prs) => {
                        res.render('prEdit',{
                        data1:mediaView,data2:adsView,data3:personView,data4:prs
                        });
                    });
                });
            });
        });
    });
};
    
controller.update = (req, res) => {
    const {id} = req.params;
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE pr SET ? WHERE id = ?', [data, id], (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.redirect('/pr'); 
        });
    });
};

controller.delete=(req,res) => {
    const idToDelete = req.params.id;
    req.getConnection((err,conn) =>{
        conn.query('DELETE FROM pr WHERE id = ?', [idToDelete], (err,pr) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/pr');
            });
        });
    };

module.exports=controller;