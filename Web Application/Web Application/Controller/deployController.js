const controller = {};
const path = require('path');

const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const token = "mcd4QHWsnzDtLcWsL6_BfbBy70NlroXar5UhuIWH6dlId0GUgMDR-0JEBW0xslhHS64MRWiW4lgBmqpXBe2rhA=="
const url = 'https://us-east-1-1.aws.cloud2.influxdata.com'
const client = new InfluxDB({url, token})
let org = '86e5ce4e5a6c211e'
let bucket = 'peeraphan009'

let writeClient = client.getWriteApi(org, bucket, 'ns');

let point = new Point('peeraphan009')
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
        
        const fluxQuery = `from(bucket: "peeraphan009")
          |> range(start: -5m)
          |> filter(fn: (r) => r["device"] == "c8:c9:a3:33:a8:dd\")
          |> filter(fn: (r) => r._measurement == "peeraphan009" and (r["_field"] == "Sonic" or r["_field"] == "R")) // เพิ่มการกรองเพื่อเลือกค่า Sonic และ R
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
            const point = new Point('peeraphan009').intField('Sonic', Sonicvalue);

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
        conn.query('SELECT deploy09.did, device09.Name, device09.mac, device09.Model, device09.version, site09.Name AS sname, site09.address, deploy09.install, deploy09.comment FROM deploy09 JOIN device09 ON deploy09.did09 = device09.did JOIN site09 ON deploy09.sid09 = site09.sid', (err, deploy09) => { 
            if (err) {
                res.json(err);
                return;
            }
            res.render('../Views/Deploy/deploy', { deploy09: deploy09, session: req.session }); 
        });
    });
};

controller.new = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }
        conn.query('SELECT * FROM device09;', (err, device09) => {
            if (err) {
                res.json(err);
                return;
            }
            conn.query('SELECT * FROM site09;', (err, site09) => {
                if (err) {
                    res.json(err);
                    return;
                }
                res.render('../Views/Deploy/deployForm', { device09: device09, site09: site09, session: req.session });
            });
        });
    });
};

controller.add = (req, res) => {
    const data = req.body;
    data.install = new Date(data.install).toISOString().split('T')[0];
    data.did09 = parseInt(data.did09);
    data.sid09 = parseInt(data.sid09);
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }
        conn.query('INSERT INTO deploy09 (did09, sid09, install, comment) VALUES (?, ?, ?, ?)', 
            [data.did09, data.sid09, data.install, data.comment], 
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
        conn.query('DELETE FROM deploy09 WHERE did = ?', [id], (err, deploy09) => {
            if (err) {
                res.json(err);
                return;
            }
            console.log(deploy09);
            res.redirect('/deploy');
        });
    });
};

controller.edit = (req, res) => {
    const idToEdit = req.params.did;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM deploy09 WHERE did = ?', [idToEdit], (err, deploy09) => {
            conn.query('SELECT * FROM device09',  (err, device09) => {
                conn.query('SELECT * FROM site09', (err, site09) => {
                    res.render('../Views/Deploy/deployEdit', {
                        data1: deploy09,
                        data2: device09,
                        data3: site09,
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
            Install: req.body.Install,
            Comment: req.body.Comment,
            sid09: req.body.sid09,
            did09: req.body.did09, // แก้จาก req.body.did เป็น req.body.didde
        };
        req.getConnection((err, conn) => {
            conn.query('UPDATE deploy09 SET ? WHERE did = ?', [updatedData, idToEdit], (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                res.redirect('/deploy');
            });
        });
    }
module.exports = controller;


