const controller = {};
const path = require('path');

const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const token = "WTV8JfkhRFSyi1afwUSMn2Ft5fxsxLVhsDz-jZQjVyJAr9Y7HGy4KXtprXV5I8GqdSTlAd_ozijsvrgc_eZKhw=="
const url = 'https://us-east-1-1.aws.cloud2.influxdata.com'
const client = new InfluxDB({url, token})
let org = '86e5ce4e5a6c211e'
let bucket = 'Random09'

let writeClient = client.getWriteApi(org, bucket, 'ns');

let point = new Point('digit09')
// .tag('device','abc')
.intField('ab09', 99);
void setTimeout(() => {
writeClient.writePoint(point)
}, 1000) // separate points by 1 second
void setTimeout(() => {
writeClient.flush()
}, 5000)

controller.Dist = async (req, res) => {
    let ab09 = null;
    let cd09= null;
    let ef09 = null; 
    let xy09= null;

    try {
        const queryClient = client.getQueryApi(org);
        
        const fluxQuery = `from(bucket: "Random09")
          |> range(start: -5m)
          |> filter(fn: (r) => r["device"] == "c8:c9:a3:33:a8:dd")
          |> filter(fn: (r) => r._measurement == "digit09" and (r["_field"] == "ab09" or r["_field"] == "cd09" or r["_field"] == "ef09" or r["_field"] == "xy09")) // เพิ่มการกรองเพื่อเลือกค่า Sonic และ R
          |> last()`;

        await new Promise((resolve, reject) => {
            queryClient.queryRows(fluxQuery, {
                next: (row, tableMeta) => {
                    const tableObject = tableMeta.toObject(row);
                    console.log(tableObject._value);
                    if (tableObject._field === "ab09") {
                        ab09 = tableObject._value;
                    } else if (tableObject._field === "cd09") {
                        cd09 = tableObject._value;
                    } else if (tableObject._field === "ef09") {
                        ef09 = tableObject._value;
                    }else if (tableObject._field === "xy09") {
                        xy09 = tableObject._value;
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

        if (ab09 !== null) {
            const point = new Point('digit09').intField('ab09', ab09);            

            await new Promise(resolve => setTimeout(resolve, 1000));
            writeClient.writePoint(point);

            await new Promise(resolve => setTimeout(resolve, 4000));
            writeClient.flush();
        }

        if(xy09 == 0){
            xy09 = "stop";
        } else if (xy09 == 1) {
            xy09 = "Clockwise";
        }else if (xy09 == 2) {
            xy09 = "Counterclockwise";
        }


    res.render("Dist", { data: { ab09, cd09, ef09, xy09 } }); // ส่ง Sonicvalue และ Rvalue ไปยังหน้าเว็บ
    } catch (error) {
        console.error("Error", error);
        res.render("Dist", { data: { ab09, cd09, ef09, xy09 } }); // ส่ง Sonicvalue และ Rvalue ไปยังหน้าเว็บ
    }
};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {  
            res.json(err);
            return;
        }
        conn.query('SELECT r009.rf09,rg09,t009.tn09,t009.to09,s009.sk09 FROM r009  JOIN s009 ON r009.rh09 = s009.si09  JOIN t009 ON s009.sj09 = tm09', (err, r009) => { 
            if (err) {
                res.json(err);
                return;
            }
            res.render('../Views/R009/r009', { r009: r009, session: req.session }); 
        });
    });
};

controller.new = (req, res) => {
    req.getConnection((err, conn) => {
        
        if (err) {
            res.json(err);
            return;
        }
        conn.query('SELECT * FROM s009;', (err, s009) => {
            if (err) {
                res.json(err);
                return;
            }
                res.render('../Views/R009/r009Form', { s009:s009,session: req.session });
            });
        });
    }

controller.add = (req, res) => {
    const data = req.body;
    data.s009 = parseInt(data.s009);
    // data.digit = parseInt(data.digit);
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }
        conn.query('INSERT INTO r009 (rg09, rh09) VALUES (?, ?)', 
            [data.rg09, data.rh09], 
            (err, r009Form) => {
                if (err) {
                    res.json(err);
                    return;
                }
                console.log(r009Form);
                res.redirect('/r009');
            });
    });
};

controller.delete = (req, res) => {
    const data = req.body.data;
      res.render('../Views/R009/r009del', {
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
        conn.query('DELETE FROM r009 WHERE rf09 = ?', [id], (err, r009) => {
            if (err) {
                res.json(err);
                return;
            }
            console.log(r009);
            res.redirect('/r009');
        });
    });
};

controller.edit = (req, res) => {
    const idToEdit = req.params.did;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM r009 WHERE rf09 = ?', [idToEdit], (err, r009) => {
            conn.query('SELECT * FROM s009',  (err, s009) => {
                    res.render('../Views/R009/r009Edit', {
                        data1: r009,
                        data2: s009,
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
            rg09: req.body.rg09,
            rh09: req.body.rh09,
        };
        req.getConnection((err, conn) => {
            conn.query('UPDATE r009 SET ? WHERE rf09 = ?', [updatedData, idToEdit], (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                res.redirect('/r009');
            });
        });
    }
module.exports = controller;


