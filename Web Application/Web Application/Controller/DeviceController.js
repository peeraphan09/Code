const controller = {};

const path = require('path');

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        } else {
            conn.query('select * from device09', (err, device09) => { 
                if (err) {
                    res.json(err);
                } else {
                    res.render('../Views/Device', { device09: device09 }); 
                }
            });
        }
    });
};

controller.new = (req, res) => {
    req.getConnection((err, conn) => 
        conn.query('SELECT * FROM device09',(err, device09) => { 
                res.render('../Views/DeviceForm', {
                    device09 :device09
            })
        })
    )
}
controller.add = (req, res) => {
    const { Name, mac, Model,version} = req.body;
    const device09 = { Name, mac, Model,version};
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        } else {
            conn.query('INSERT INTO device09 SET ?', device09, (err, deviceForm) => {
                if (err) {
                    res.json(err);
                } else {
                    console.log(deviceForm);
                    res.redirect('/device'); // ลบพารามิเตอร์ที่ไม่จำเป็นออก
                }
            });
        }
    });
};


controller.delete = (req, res) => {
    const device09 = req.body.data;
    res.render('../Views/Devicedel', {
        data: device09
    });
};

controller.delete00 = (req, res) => {
    const id = req.params.did;
    req.getConnection((err, conn) => {
        if (err) {
            return res.json(err);
        }
        conn.query('DELETE FROM device09 WHERE did = ?', [id], (err, Device09) => {
            console.log(Device09);
            res.redirect('/Device');
        });
    });
};

controller.edit = (req, res) => {
    const id = req.params.did; // ใช้ req.params.eid ในทั้งสองฟังก์ชัน
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM device09 WHERE did = ?', [id], (err, device) => {
            if (err) {
                res.json(err);
            }
            res.render('../Views/DeviceEdit', {
                device09: device[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const id = req.params.did; // ใช้ req.params.eid ในทั้งสองฟังก์ชัน
    const device09 = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE device09 SET ? WHERE did = ?', [device09, id], (err, device) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/device');
        });
    });
};





module.exports = controller;
