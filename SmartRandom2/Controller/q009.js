const controller = {};

const path = require('path');

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        } else {
            conn.query('select * from q009', (err, q009) => { 
                if (err) {
                    res.json(err);
                } else {
                    res.render('../Views/q009', { q009: q009 }); 
                }
            });
        }
    });
};

controller.new = (req, res) => {
    req.getConnection((err, conn) => 
        conn.query('SELECT * FROM q009',(err, q009) => { 
                res.render('../Views/q009Form', {
                    q009 :q009
            })
        })
    )
}
controller.add = (req, res) => {
    const {qm09,qn09} = req.body;
    const q009 = { qm09,qn09};
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        } else {
            conn.query('INSERT INTO q009 SET ?', q009, (err, q009Form) => {
                if (err) {
                    res.json(err);
                } else {
                    console.log(q009Form);
                    res.redirect('/q009'); // ลบพารามิเตอร์ที่ไม่จำเป็นออก
                }
            });
        }
    });
};


controller.delete = (req, res) => {
    const q009 = req.body.data;
    res.render('../Views/q009del', {
        data: q009
    });
};


controller.delete00 = (req, res) => {
    const id = req.params.did;
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }
        conn.query('DELETE FROM q009 WHERE qk09 = ?', [id], (err, q009) => {
            console.log(q009);
            res.redirect('/q009');
        });
    });
};

controller.edit = (req, res) => {
    const id = req.params.did; // ใช้ req.params.eid ในทั้งสองฟังก์ชัน
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM q009 WHERE qk09 = ?', [id], (err, q009) => {
            if (err) {
                res.json(err);
            }
            res.render('../Views/q009Edit', {
                q009: q009[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const id = req.params.did; // ใช้ req.params.eid ในทั้งสองฟังก์ชัน
    const q009 = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE q009 SET ? WHERE qk09 = ?', [q009, id], (err, q009) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/q009');
        });
    });
};





module.exports = controller;
