const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');
const cors = require('cors');

const app = express();

const port = 8000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, (err, client) => {
  const db = client.db('payroll');
  if (err) return console.log(err);
  require('./app/routes')(app, db);
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });
});
