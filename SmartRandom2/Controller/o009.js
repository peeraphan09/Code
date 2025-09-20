const controller = {};
const path = require('path');

const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const token = "ed74ThNw94ZiziL77JczV4f0Nf3tceW2N2fdHuIPN6NXuPgSfiKnElEtJCShRp1esKWhuG5QBWnQuTv8kW_MnA=="
const url = 'https://us-east-1-1.aws.cloud2.influxdata.com'
const client = new InfluxDB({url, token})
let org = '86e5ce4e5a6c211e'
let bucket = "peeraphan"

let writeClient = client.getWriteApi(org, bucket, 'ns');

let point = new Point('boonpun')
// .tag('device','abc')
.intField('R651998009', 99);
void setTimeout(() => {
writeClient.writePoint(point)
}, 1000) // separate points by 1 second
void setTimeout(() => {
writeClient.flush()
}, 5000)

controller.Dist = async (req, res) => {
    let R651998009 = null;
    let D09= null;
    let T09 = null; 
    let H651998009= null;
    let A09= null;

    try {
        const queryClient = client.getQueryApi(org);
        
        const fluxQuery = `from(bucket: "peeraphan")
          |> range(start: -5m)
          |> filter(fn: (r) => r["device"] == "c8:c9:a3:33:a8:dd")
          |> filter(fn: (r) => r._measurement == "boonpun" and (r["_field"] == "R651998009" or r["_field"] == "D09" or r["_field"] == "T09" or r["_field"] == "H651998009" or r["_field"] == "A09")) // เพิ่มการกรองเพื่อเลือกค่า Sonic และ R
          |> last()`;

        await new Promise((resolve, reject) => {
            queryClient.queryRows(fluxQuery, {
                next: (row, tableMeta) => {
                    const tableObject = tableMeta.toObject(row);
                    console.log(tableObject._value);
                    if (tableObject._field === "R651998009") {
                        R651998009 = tableObject._value;
                    } else if (tableObject._field === "D09") {
                        D09 = tableObject._value;
                    } else if (tableObject._field === "T09") {
                        T09 = tableObject._value;
                    }else if (tableObject._field === "H651998009") {
                        H651998009 = tableObject._value;
                    }else if (tableObject._field === "A09") {
                        A09 = tableObject._value;
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

        if (R651998009 !== null) {
            const point = new Point('boonpun').intField('R651998009', R651998009);            

            await new Promise(resolve => setTimeout(resolve, 1000));
            writeClient.writePoint(point);

            await new Promise(resolve => setTimeout(resolve, 4000));
            writeClient.flush();
        }

        if(A09 == 0){
            A09 = "0 c";
        } else if (A09 == 45) {
            A09 = "45 c";
        }else if (A09 == 90) {
            A09 = "90 c";
        }


    res.render("Dist", { data: { R651998009, D09, T09, H651998009, A09 } }); // ส่ง Sonicvalue และ Rvalue ไปยังหน้าเว็บ
    } catch (error) {
        console.error("Error", error);
        res.render("Dist", { data: { R651998009, D09, T09, H651998009, A09 } }); // ส่ง Sonicvalue และ Rvalue ไปยังหน้าเว็บ
    }
};


controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {  
            res.json(err);
            return;
        }
        conn.query('SELECT o009.oe09,xy09,of09,q009.qm09 as og09,q009.qn09 FROM o009 JOIN q009 ON o009.og09 = q009.qk09 ', (err, o009) => { 
            if (err) {
                res.json(err);
                return;
            }
            res.render('../Views/O009/o009', {o009: o009, session: req.session }); 
        });
    });
};

controller.new = (req, res) => {
    req.getConnection((err, conn) => {
        
        if (err) {
            res.json(err);
            return;
        }
        conn.query('SELECT * FROM q009;', (err, q009) => {
            if (err) {
                res.json(err);
                return;
            }
                res.render('../Views/O009/o009Form', { q009:q009,session: req.session });
            });
        });
    }

controller.add = (req, res) => {
    const data = req.body;
    data.q009 = parseInt(data.q009);
    // data.digit = parseInt(data.digit);
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
            return;
        }
        conn.query('INSERT INTO o009 (xy09, of09, og09) VALUES (?, ?, ?)', 
            [data.xy09, data.of09, data.og09], 
            (err, o009Form) => {
                if (err) {
                    res.json(err);
                    return;
                }
                console.log(o009Form);
                res.redirect('/o009');
            });
    });
};

controller.delete = (req, res) => {
    const data = req.body.data;
      res.render('../Views/O009/o009del', {
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
        conn.query('DELETE FROM o009 WHERE oe09 = ?', [id], (err, o009) => {
            if (err) {
                res.json(err);
                return;
            }
            console.log(o009);
            res.redirect('/o009');
        });
    });
};

controller.edit = (req, res) => {
    const idToEdit = req.params.did;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM o009 WHERE oe09 = ?', [idToEdit], (err, o009) => {
            conn.query('SELECT * FROM q009',  (err, q009) => {
                    res.render('../Views/O009/o009Edit', {
                        data1: o009,
                        data2: q009,
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
            xy09: req.body.xy09,
            of09: req.body.of09,
            og09: req.body.og09,
        };
        req.getConnection((err, conn) => {
            conn.query('UPDATE o009 SET ? WHERE oe09 = ?', [updatedData, idToEdit], (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                res.redirect('/o009');
            });
        });
    }
module.exports = controller;


