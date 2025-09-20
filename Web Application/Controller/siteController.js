const controller = {};

const path = require('path');

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        } else {
            conn.query('select * from site21', (err, site21) => { 
                if (err) {
                    res.json(err);
                } else {
                    res.render('../Views/Site/site', { site21: site21 }); 
                }
            });
        }
    });
};

controller.new = (req, res) => {
    req.getConnection((err, conn) => 
        conn.query('SELECT * FROM site21',(err, site21) => { 
                res.render('../Views/Site/siteForm', {
                    site21 :site21
            })
        })
    )
}
controller.add = (req, res) => {
    const { Name, address} = req.body;
    const site21 = { Name, address};
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        } else {
            conn.query('INSERT INTO site21 SET ?', site21, (err, siteForm) => {
                if (err) {
                    res.json(err);
                } else {
                    console.log(siteForm);
                    res.redirect('/site'); // ลบพารามิเตอร์ที่ไม่จำเป็นออก
                }
            });
        }
    });
};


controller.delete = (req, res) => {
    const site21 = req.body.data;
    res.render('../Views/Site/siteDel', {
        data: site21
    });
};

controller.delete00 = (req, res) => {
    const id = req.params.sid;
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }
        conn.query('DELETE FROM site21 WHERE sid = ?', [id], (err, site21) => {
            console.log(site21);
            res.redirect('/site');
        });
    });
};

controller.edit = (req, res) => {
    const id = req.params.sid; // ใช้ req.params.eid ในทั้งสองฟังก์ชัน
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM site21 WHERE sid = ?', [id], (err, site) => {
            if (err) {
                res.json(err);
            }
            res.render('../Views/Site/siteEdit', {
                site21: site[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const id = req.params.sid; // ใช้ req.params.eid ในทั้งสองฟังก์ชัน
    const site21 = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE site21 SET ? WHERE sid = ?', [site21, id], (err, site) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/site');
        });
    });
};





module.exports = controller;
