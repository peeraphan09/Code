const controller = {};
const path = require('path');

const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const token = "Pdpqfp0l-tph_LEsiEaM_A_ed0uNFQfGsjdnNmnEej8jqIm-8nmq9jLoFvgKpDb5-OPw-FeF-P2hDZJtvoWkFA=="
const url = 'https://us-east-1-1.aws.cloud2.influxdata.com'
const client = new InfluxDB({url, token})
let org = '86e5ce4e5a6c211e'
let bucket = 'Final09'

let writeClient = client.getWriteApi(org, bucket, 'ns');

let point = new Point('farm09')
// .tag('device','abc')
.intField('Drit', 99);
void setTimeout(() => {
writeClient.writePoint(point)
}, 1000) // separate points by 1 second
void setTimeout(() => {
writeClient.flush()
}, 5000)

controller.Dist = async (req, res) => {
    let ความชื้นดิน = null;
    let ปริมาณฝน= null;
    let สถานะการทำงาน = null; // เพิ่มการประกาศ Rvalue ที่นี่

    try {
        const queryClient = client.getQueryApi(org);
        
        const fluxQuery = `from(bucket: "Final09")
          |> range(start: -5m)
          |> filter(fn: (r) => r["device"] == "c8:c9:a3:33:a8:dd")
          |> filter(fn: (r) => r._measurement == "farm09" and (r["_field"] == "Dirt" or r["_field"] == "Fon" or r["_field"] == "Relay")) // เพิ่มการกรองเพื่อเลือกค่า Sonic และ R
          |> last()`;

        await new Promise((resolve, reject) => {
            queryClient.queryRows(fluxQuery, {
                next: (row, tableMeta) => {
                    const tableObject = tableMeta.toObject(row);
                    console.log(tableObject._value);
                    if (tableObject._field === "Dirt") {
                        ความชื้นดิน = tableObject._value;
                    } else if (tableObject._field === "Fon") {
                        ปริมาณฝน = tableObject._value;
                    } else if (tableObject._field === "Relay") {
                        สถานะการทำงาน = tableObject._value;
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

        if (ความชื้นดิน !== null) {
            const point = new Point('farm09').intField('Dirt', ความชื้นดิน);            

            await new Promise(resolve => setTimeout(resolve, 1000));
            writeClient.writePoint(point);

            await new Promise(resolve => setTimeout(resolve, 4000));
            writeClient.flush();
        }
    res.render("Dist", { data: { ความชื้นดิน, ปริมาณฝน, สถานะการทำงาน } }); // ส่ง Sonicvalue และ Rvalue ไปยังหน้าเว็บ
    } catch (error) {
        console.error("Error", error);
        res.render("Dist", { data: { ความชื้นดิน, ปริมาณฝน, สถานะการทำงาน } }); // ส่ง Sonicvalue และ Rvalue ไปยังหน้าเว็บ
    }
};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {  
            res.json(err);
            return;
        }
        conn.query('SELECT peeraphan09.peeid,boonpun09.name09 as boonpun,boonpun09.digit09 as digit,mirot09 FROM peeraphan09 JOIN boonpun09 ON peeraphan09.boonpun =boonpun09.id ', (err, peeraphan09) => { 
            if (err) {
                res.json(err);
                return;
            }
            res.render('../Views/Peeraphan/peeraphan', { peeraphan09: peeraphan09, session: req.session }); 
        });
    });
};

controller.new = (req, res) => {
    req.getConnection((err, conn) => {
        
        if (err) {
            res.json(err);
            return;
        }
        conn.query('SELECT * FROM boonpun09;', (err, boonpun09) => {
            if (err) {
                res.json(err);
                return;
            }
                res.render('../Views/Peeraphan/peeraphanForm', { boonpun09:boonpun09,session: req.session });
            });
        });
    }

controller.add = (req, res) => {
    const data = req.body;
    data.boonpun = parseInt(data.boonpun);
    // data.digit = parseInt(data.digit);
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }
        conn.query('INSERT INTO peeraphan09 (boonpun, mirot09) VALUES (?, ?)', 
            [data.boonpun, data.mirot09], 
            (err, peeraphanForm) => {
                if (err) {
                    res.json(err);
                    return;
                }
                console.log(peeraphanForm);
                res.redirect('/peeraphan');
            });
    });
};

controller.delete = (req, res) => {
    const data = req.body.data;
      res.render('../Views/Peeraphan/peeraphandel', {
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
        conn.query('DELETE FROM peeraphan09 WHERE peeid = ?', [id], (err, peeraphan09) => {
            if (err) {
                res.json(err);
                return;
            }
            console.log(peeraphan09);
            res.redirect('/peeraphan');
        });
    });
};

controller.edit = (req, res) => {
    const idToEdit = req.params.did;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM peeraphan09 WHERE peeid = ?', [idToEdit], (err, peeraphan09) => {
            conn.query('SELECT * FROM boonpun09',  (err, boonpun09) => {
                    res.render('../Views/Peeraphan/peeraphanEdit', {
                        data1: peeraphan09,
                        data2: boonpun09,
                        session: req.session
                    });
                });
            });
        });
    };
;

controller.update = (req, res) => {
        const idToEdit = req.params.did;
        const updatedData = {
            boonpun: req.body.boonpun,
            mirot09: req.body.mirot09,
        };
        req.getConnection((err, conn) => {
            conn.query('UPDATE peeraphan09 SET ? WHERE peeid = ?', [updatedData, idToEdit], (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                res.redirect('/peeraphan');
            });
        });
    }
module.exports = controller;


