const DB_CONNECTION_ERROR = { error: 'DB Connection Error' };

module.exports = function(app, db) {
  app.post('/pay', (req, res) => {
    const {
      firstName,
      lastName,
      salary,
      superAmount,
      incomeTax,
      netIncome,
      pay,
      day,
      month,
      year
    } = req.body;

    console.log(req.body);

    const paymentDetails = {
      firstName,
      lastName,
      salary,
      superAmount,
      incomeTax,
      netIncome,
      pay,
      day,
      month,
      year
    };

    for (var key in paymentDetails) {
      if (!paymentDetails[key]) {
        res.send({ error: 'Some values are missing' });
        return;
      }
    }

    if (salary <= 0 || netIncome <= 0 || pay <= 0) {
      res.send({ error: 'Income values are less than 0' });
      return;
    }

    const date = new Date();
    if (
      day != date.getDate() ||
      month != date.getMonth() ||
      year != date.getFullYear()
    ) {
      res.send({ error: 'Date values are incorrect' });
      return;
    }

    const details = { firstName, lastName, year, month };
    db.collection('payments').findOne(details, (err, item) => {
      if (err) {
        res.send(DB_CONNECTION_ERROR);
        return;
      } else {
        if (item === null) {
          db.collection('payments').insert(paymentDetails, (err, result) => {
            if (err) res.send(DB_CONNECTION_ERROR);
            else res.send({ error: false });
          });
        } else {
          res.send({ error: 'Employee already paid for this month' });
        }
      }
    });
  });
  app.get('/payments', (req, res) => {
    db.collection('payments')
      .find({})
      .toArray(function(err, result) {
        if (err) res.send(DB_CONNECTION_ERROR);
        res.send(result);
      });
  });
};
