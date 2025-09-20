const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM customer', (err, customers) => {
            if (err) {
                res.json(err);
            }
            res.render('customers', {
                data: customers
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO customer SET ?', [data], (err, customers) => {
            if (err) {
                res.json(err);
            }
            console.log(customers);
            res.redirect('/');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query("DELETE FROM customer WHERE id = ?", [id], (err, customers) => {
            if (err) {
                res.json(err);
            }
            console.log(customers);
            res.redirect('/');
        });
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query("SELECT * FROM customer WHERE id = ?", [id], (err, customers) => {
            if (err) {
                res.json(err);
            }
            res.render('customerForm', {
                data: customers[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query("UPDATE customer SET ? WHERE id = ?", [data, id], (err, customers) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/');
        });
    });
};

controller.new = (req, res) => {
    const data = null;
    res.render('customerform', {
        data: data
    });
};

module.exports = controller;
