const controller = {};
const path = require('path');

const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const token = "KknqGwAasXKTXur12_tvzC50P52DDEPbaDaXHQuHVN9R-53-f7O9D1W0yUguKnhYg0HjMI1wjAAkNtjuUbtZNw=="
const url = 'https://us-east-1-1.aws.cloud2.influxdata.com'
const client = new InfluxDB({url, token})
let org = '91ed54306999c955'
let bucket = 'KETMANEE'

let writeClient = client.getWriteApi(org, bucket, 'ns');

let point = new Point('KETMANEE')
// .tag('device','abc')
.intField('Sonic', 99);
void setTimeout(() => {
writeClient.writePoint(point)
}, 1000) // separate points by 1 second
void setTimeout(() => {
writeClient.flush()
}, 5000)

controller.Dist = async (req, res) => {
    let Sonicvalue = null;
    let Rvalue = null; // เพิ่มการประกาศ Rvalue ที่นี่

    try {
        const queryClient = client.getQueryApi(org);
        
        const fluxQuery = `from(bucket: "KETMANEE")
          |> range(start: -5m)
          |> filter(fn: (r) => r["device"] == "8:f9:e0:67:92:1")
          |> filter(fn: (r) => r._measurement == "KETMANEE" and (r["_field"] == "Sonic" or r["_field"] == "R")) // เพิ่มการกรองเพื่อเลือกค่า Sonic และ R
          |> mean()`;

        await new Promise((resolve, reject) => {
            queryClient.queryRows(fluxQuery, {
                next: (row, tableMeta) => {
                    const tableObject = tableMeta.toObject(row);
                    console.log(tableObject._value);
                    if (tableObject._field === "Sonic") {
                        Sonicvalue = tableObject._value;
                    } else if (tableObject._field === "R") {
                        Rvalue = tableObject._value;
                    }
                },
                error: (error) => {
                    console.error("\nError", error);
                    reject(error);
                },
                complete: () => {
                    resolve();
                },
            });
        });

        if (Sonicvalue !== null) {
            const point = new Point('KETMANEE').intField('Sonic', Sonicvalue);

            await new Promise(resolve => setTimeout(resolve, 1000));
            writeClient.writePoint(point);

            await new Promise(resolve => setTimeout(resolve, 4000));
            writeClient.flush();
        }

        res.render("Dist", { data: { Sonicvalue, Rvalue } }); // ส่ง Sonicvalue และ Rvalue ไปยังหน้าเว็บ
    } catch (error) {
        console.error("Error", error);
        res.render("Dist", { data: { Sonicvalue, Rvalue } }); // ส่ง Sonicvalue และ Rvalue ไปยังหน้าเว็บ
    }
};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {  
            res.json(err);
            return;
        }
        conn.query('SELECT deploy21.did, device21.Name, device21.mac, device21.Model, device21.version, site21.Name AS sname, site21.address, deploy21.install, deploy21.comment FROM deploy21 JOIN device21 ON deploy21.did21 = device21.did JOIN site21 ON deploy21.sid21 = site21.sid', (err, deploy21) => { 
            if (err) {
                res.json(err);
                return;
            }
            res.render('../Views/Deploy/deploy', { deploy21: deploy21, session: req.session }); 
        });
    });
};

controller.new = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }
        conn.query('SELECT * FROM device21;', (err, device21) => {
            if (err) {
                res.json(err);
                return;
            }
            conn.query('SELECT * FROM site21;', (err, site21) => {
                if (err) {
                    res.json(err);
                    return;
                }
                res.render('../Views/Deploy/deployForm', { device21: device21, site21: site21, session: req.session });
            });
        });
    });
};

controller.add = (req, res) => {
    const data = req.body;
    data.install = new Date(data.install).toISOString().split('T')[0];
    data.did21 = parseInt(data.did21);
    data.sid21 = parseInt(data.sid21);
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }
        conn.query('INSERT INTO deploy21 (did21, sid21, install, comment) VALUES (?, ?, ?, ?)', 
            [data.did21, data.sid21, data.install, data.comment], 
            (err, deployForm) => {
                if (err) {
                    res.json(err);
                    return;
                }
                console.log(deployForm);
                res.redirect('/deploy');
            });
    });
};

controller.delete = (req, res) => {
    const data = req.body.data;
      res.render('../Views/Deploy/deploydel', {
          data: data, session: req.session
    });
};

controller.delete00 = (req, res) => {
    const id = req.params.did;
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }
        conn.query('DELETE FROM deploy21 WHERE did = ?', [id], (err, deploy21) => {
            if (err) {
                res.json(err);
                return;
            }
            console.log(deploy21);
            res.redirect('/deploy');
        });
    });
};

controller.edit = (req, res) => {
    const idToEdit = req.params.did;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM deploy21 WHERE did = ?', [idToEdit], (err, deploy21) => {
            conn.query('SELECT * FROM device21',  (err, device21) => {
                conn.query('SELECT * FROM site21', (err, site21) => {
                    res.render('../Views/Deploy/deployEdit', {
                        data1: deploy21,
                        data2: device21,
                        data3: site21,
                        session: req.session
                    });
                });
            });
        });
    });
};

controller.update = (req, res) => {
        const idToEdit = req.params.did;
        const updatedData = {
            Install: req.body.install,
            Comment: req.body.comment,
            sid21: req.body.sid21,
            did21: req.body.did21, // แก้จาก req.body.did เป็น req.body.didde
        };
        req.getConnection((err, conn) => {
            conn.query('UPDATE deploy21 SET ? WHERE did = ?', [updatedData, idToEdit], (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                res.redirect('/deploy');
            });
        });
    }
;

module.exports = controller;
