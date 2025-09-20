const controller = {};
const path = require('path');

// const { InfluxDB, Point } = require("@influxdata/influxdb-client");
// const token = "Pdpqfp0l-tph_LEsiEaM_A_ed0uNFQfGsjdnNmnEej8jqIm-8nmq9jLoFvgKpDb5-OPw-FeF-P2hDZJtvoWkFA=="
// const url = 'https://us-east-1-1.aws.cloud2.influxdata.com'
// const client = new InfluxDB({url, token})
// let org = '86e5ce4e5a6c211e'
// let bucket = 'Final09'

// let writeClient = client.getWriteApi(org, bucket, 'ns');

// let point = new Point('farm09')
// // .tag('device','abc')
// .intField('Drit', 99);
// void setTimeout(() => {
// writeClient.writePoint(point)
// }, 1000) // separate points by 1 second
// void setTimeout(() => {
// writeClient.flush()
// }, 5000)

// controller.Dist = async (req, res) => {
//     let ความชื้นดิน = null;
//     let ปริมาณฝน= null;
//     let สถานะการทำงาน = null; // เพิ่มการประกาศ Rvalue ที่นี่

//     try {
//         const queryClient = client.getQueryApi(org);
        
//         const fluxQuery = `from(bucket: "Final09")
//           |> range(start: -5m)
//           |> filter(fn: (r) => r["device"] == "c8:c9:a3:33:a8:dd")
//           |> filter(fn: (r) => r._measurement == "farm09" and (r["_field"] == "Dirt" or r["_field"] == "Fon" or r["_field"] == "Relay")) // เพิ่มการกรองเพื่อเลือกค่า Sonic และ R
//           |> last()`;

//         await new Promise((resolve, reject) => {
//             queryClient.queryRows(fluxQuery, {
//                 next: (row, tableMeta) => {
//                     const tableObject = tableMeta.toObject(row);
//                     console.log(tableObject._value);
//                     if (tableObject._field === "Dirt") {
//                         ความชื้นดิน = tableObject._value;
//                     } else if (tableObject._field === "Fon") {
//                         ปริมาณฝน = tableObject._value;
//                     } else if (tableObject._field === "Relay") {
//                         สถานะการทำงาน = tableObject._value;
//                     }
                    
//                 },
//                 error: (error) => {
//                     console.error("\nError", error);
//                     reject(error);
//                 },
//                 complete: () => {
//                     resolve();
//                 },
//             });
//         });

//         if (ความชื้นดิน !== null) {
//             const point = new Point('farm09').intField('Dirt', ความชื้นดิน);            

//             await new Promise(resolve => setTimeout(resolve, 1000));
//             writeClient.writePoint(point);

//             await new Promise(resolve => setTimeout(resolve, 4000));
//             writeClient.flush();
//         }
//     res.render("Dist", { data: { ความชื้นดิน, ปริมาณฝน, สถานะการทำงาน } }); // ส่ง Sonicvalue และ Rvalue ไปยังหน้าเว็บ
//     } catch (error) {
//         console.error("Error", error);
//         res.render("Dist", { data: { ความชื้นดิน, ปริมาณฝน, สถานะการทำงาน } }); // ส่ง Sonicvalue และ Rvalue ไปยังหน้าเว็บ
//     }
// };

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {  
            res.json(err);
            return;
        }
        conn.query('SELECT s009.si09,t009.tn09 as sj09,t009.to09,sk09 FROM s009 JOIN t009 ON s009.sj09 = t009.tm09 ', (err, s009) => { 
            if (err) {
                res.json(err);
                return;
            }
            res.render('../Views/S009/s009', { s009: s009, session: req.session }); 
        });
    });
};

controller.new = (req, res) => {
    req.getConnection((err, conn) => {
        
        if (err) {
            res.json(err);
            return;
        }
        conn.query('SELECT * FROM t009;', (err, t009) => {
            if (err) {
                res.json(err);
                return;
            }
                res.render('../Views/S009/s009Form', { t009:t009,session: req.session });
            });
        });
    }

controller.add = (req, res) => {
    const data = req.body;
    data.t009 = parseInt(data.t009);
    // data.digit = parseInt(data.digit);
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }
        conn.query('INSERT INTO s009 (sj09, sk09) VALUES (?, ?)', 
            [data.sj09, data.sk09], 
            (err, s009Form) => {
                if (err) {
                    res.json(err);
                    return;
                }
                console.log(s009Form);
                res.redirect('/s009');
            });
    });
};

controller.delete = (req, res) => {
    const data = req.body.data;
      res.render('../Views/S009/s009del', {
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
        conn.query('DELETE FROM s009 WHERE si09 = ?', [id], (err, s009) => {
            if (err) {
                res.json(err);
                return;
            }
            console.log(s009);
            res.redirect('/s009');
        });
    });
};

controller.edit = (req, res) => {
    const idToEdit = req.params.did;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM s009 WHERE si09 = ?', [idToEdit], (err, s009) => {
            conn.query('SELECT * FROM t009',  (err, t009) => {
                    res.render('../Views/S009/s009Edit', {
                        data1: s009,
                        data2: t009,
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
            sj09: req.body.sj09,
            sk09: req.body.sk09,
        };
        req.getConnection((err, conn) => {
            conn.query('UPDATE s009 SET ? WHERE si09 = ?', [updatedData, idToEdit], (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                res.redirect('/s009');
            });
        });
    }
module.exports = controller;


