const controller = {};

// const path = require('path');

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        } else {
            conn.query('select * from site09', (err, site09) => { 
                if (err) {
                    res.json(err);
                } else {
                    res.render('../Views/SiteViews/site', { site09: site09 }); 
                }
            });
        }
    });
};

controller.new = (req, res) => {
    req.getConnection((err, conn) => 
        conn.query('SELECT * FROM site09',(err, site09) => { 
                res.render('../Views/SiteViews/siteForm', {
                    site09 :site09
            })
        })
    )
}
controller.add = (req, res) => {
    const { Name, address } = req.body;
    const site09 = { Name, address }; 
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        } else {
            conn.query('INSERT INTO site09 SET ?', site09, (err, siteForm) => {
                if (err) {
                    res.json(err);
                } else {
                    console.log(siteForm);
                    res.redirect('/site');
                }
            });
        }
    });
};



controller.delete = (req, res) => {
    const site09 = req.body.data;
    res.render('../Views/SiteViews/sitedel', {
        data: { site09}
    });
};

controller.delete00 = (req, res) => {
    const id = req.params.sid;
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }
        conn.query('DELETE FROM site09 WHERE sid = ?', [id], (err, site09) => {
            console.log(site09);
            res.redirect('/site');
        });
    });
};

controller.edit = (req, res) => {
    const id = req.params.sid; 
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM site09 WHERE sid = ?', [id], (err, site) => {
            if (err) {
                res.json(err);
            }
            res.render('../Views/SiteViews/siteEdit', {
                site09: site[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const id = req.params.sid; 
    const site09 = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE site09 SET ? WHERE sid = ?', [site09, id], (err, site) => {
            if (err) {
                return res.json(err); // ใส่ return ที่นี่
            }
            return res.redirect('/site'); // ใส่ return ที่นี่
        });
    });
};






module.exports = controller;
