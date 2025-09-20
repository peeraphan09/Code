const controller = {};

const path = require('path');

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        } else {
            conn.query('select * from device21', (err, device21) => { 
                if (err) {
                    res.json(err);
                } else {
                    res.render('../Views/Device/Device', { device21: device21 }); 
                }
            });
        }
    });
};

controller.new = (req, res) => {
    req.getConnection((err, conn) => 
        conn.query('SELECT * FROM device21',(err, device21) => { 
                res.render('../Views/Device/Deviceform', {
                    device21 :device21
            })
        })
    )
}
controller.add = (req, res) => {
    const { Name, mac, Model,version} = req.body;
    const device21 = { Name, mac, Model,version};
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        } else {
            conn.query('INSERT INTO device21 SET ?', device21, (err, deviceform) => {
                if (err) {
                    res.json(err);
                } else {
                    console.log(deviceform);
                    res.redirect('/device'); // ลบพารามิเตอร์ที่ไม่จำเป็นออก
                }
            });
        }
    });
};


controller.delete = (req, res) => {
    const device21 = req.body.data;
    res.render('../Views/Device/Devicedel', {
        data: device21
    });
};

controller.delete00 = (req, res) => {
    const id = req.params.did;
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }
        conn.query('DELETE FROM device21 WHERE did = ?', [id], (err, Device21) => {
            console.log(Device21);
            res.redirect('/Device');
        });
    });
};

controller.edit = (req, res) => {
    const id = req.params.did; // ใช้ req.params.eid ในทั้งสองฟังก์ชัน
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM device21 WHERE did = ?', [id], (err, device) => {
            if (err) {
                res.json(err);
            }
            res.render('../Views/Device/Deviceedit', {
                device21: device[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const id = req.params.did; // ใช้ req.params.eid ในทั้งสองฟังก์ชัน
    const device21 = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE device21 SET ? WHERE did = ?', [device21, id], (err, device) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/device');
        });
    });
};





module.exports = controller;
