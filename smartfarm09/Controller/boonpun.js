const controller = {};

const path = require('path');

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        } else {
            conn.query('select * from boonpun09', (err, boonpun09) => { 
                if (err) {
                    res.json(err);
                } else {
                    res.render('../Views/boonpun', { boonpun09: boonpun09 }); 
                }
            });
        }
    });
};

controller.new = (req, res) => {
    req.getConnection((err, conn) => 
        conn.query('SELECT * FROM boonpun09',(err, boonpun09) => { 
                res.render('../Views/boonpunForm', {
                    boonpun09 :boonpun09
            })
        })
    )
}
controller.add = (req, res) => {
    const { name09,digit09} = req.body;
    const boonpun09 = { name09,digit09};
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        } else {
            conn.query('INSERT INTO boonpun09 SET ?', boonpun09, (err, boonpunForm) => {
                if (err) {
                    res.json(err);
                } else {
                    console.log(boonpunForm);
                    res.redirect('/boonpun'); // ลบพารามิเตอร์ที่ไม่จำเป็นออก
                }
            });
        }
    });
};


controller.delete = (req, res) => {
    const boonpun09 = req.body.data;
    res.render('../Views/boonpundel', {
        data: boonpun09
    });
};

controller.delete00 = (req, res) => {
    const id = req.params.did;
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }
        conn.query('DELETE FROM boonpun09 WHERE id = ?', [id], (err, boonpun09) => {
            console.log(boonpun09);
            res.redirect('/boonpun');
        });
    });
};

controller.edit = (req, res) => {
    const id = req.params.did; // ใช้ req.params.eid ในทั้งสองฟังก์ชัน
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM boonpun09 WHERE id = ?', [id], (err, boonpun) => {
            if (err) {
                res.json(err);
            }
            res.render('../Views/boonpunEdit', {
                boonpun09: boonpun[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const id = req.params.did; // ใช้ req.params.eid ในทั้งสองฟังก์ชัน
    const boonpun09 = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE boonpun09 SET ? WHERE id = ?', [boonpun09, id], (err, boonpun) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/boonpun');
        });
    });
};





module.exports = controller;
