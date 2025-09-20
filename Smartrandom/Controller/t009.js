const controller = {};

const path = require('path');

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        } else {
            conn.query('select * from t009', (err, t009) => { 
                if (err) {
                    res.json(err);
                } else {
                    res.render('../Views/t009', { t009: t009 }); 
                }
            });
        }
    });
};

controller.new = (req, res) => {
    req.getConnection((err, conn) => 
        conn.query('SELECT * FROM t009',(err, t009) => { 
                res.render('../Views/t009Form', {
                    t009 :t009
            })
        })
    )
}
controller.add = (req, res) => {
    const { tn09,to09} = req.body;
    const t009 = { tn09,to09};
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        } else {
            conn.query('INSERT INTO t009 SET ?', t009, (err, t009Form) => {
                if (err) {
                    res.json(err);
                } else {
                    console.log(t009Form);
                    res.redirect('/t009'); // ลบพารามิเตอร์ที่ไม่จำเป็นออก
                }
            });
        }
    });
};


controller.delete = (req, res) => {
    const t009 = req.body.data;
    res.render('../Views/t009del', {
        data: t009
    });
};


controller.delete00 = (req, res) => {
    const id = req.params.did;
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }
        conn.query('DELETE FROM t009 WHERE tm09 = ?', [id], (err, t009) => {
            console.log(t009);
            res.redirect('/t009');
        });
    });
};

controller.edit = (req, res) => {
    const id = req.params.did; // ใช้ req.params.eid ในทั้งสองฟังก์ชัน
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM t009 WHERE tm09 = ?', [id], (err, t009) => {
            if (err) {
                res.json(err);
            }
            res.render('../Views/t009Edit', {
                t009: t009[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const id = req.params.did; // ใช้ req.params.eid ในทั้งสองฟังก์ชัน
    const t009 = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE t009 SET ? WHERE tm09 = ?', [t009, id], (err, t009) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/t009');
        });
    });
};





module.exports = controller;
