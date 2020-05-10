const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.set('port', (process.env.PORT || 5000));

let db_config_online = {
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'bbd7861425ff0a',
  password: 'ddb27741',
  database: 'heroku_304847af8f42339'
};

let db_config_offline = {
  host: 'localhost',
  user: 'root',
  password: 'PpeqSQL_t37151113',
  database: 'applist'
};

let pool = mysql.createPool(db_config_offline);

dateNull = (date) => date? date : null;

app.get('/', (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      'SELECT * FROM foodstock_taichi ORDER BY expirationDate ASC, expirationType IS NULL ASC, expirationType ASC',
      (error, results) => {
        res.render('top.ejs', {items: results, url: req.url});
      }
    );
  });
});

app.post('/delete/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      'delete from foodstock_taichi where id = ?',
      [req.params.id],
      (error, results) => {
        res.redirect('/');
      }
    );
  });
});

app.post('/add', (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      'insert into foodstock_taichi (name, purchaseDate, expirationDate, expirationType) values (?, ?, ?, ?)',
      [req.body.itemName, dateNull(req.body.itemPurchaseDate), dateNull(req.body.itemExpirationDate), req.body.itemType],
      (error, results) => {
        res.redirect('/');
      }
    );
  });
});

app.listen(app.get('port'));