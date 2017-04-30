var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gamestore_database'
});

module.exports = function (app) {

  ////////////////
  // test route //
  ////////////////
  app.route('/test')
    .get((req, res) => {
      connection.query('SELECT name, price FROM games WHERE price < 1000', (err, result) => {
        return res.json(result)
      })
    })

  ////////////////
  // home route //
  ////////////////
  app.route('/')
    .get((req, res) => {
      res.render('index.html')
    })

  ////////////////////////
  // registration route //
  ////////////////////////
  app.route('/regis')
    .get((req, res) => {
      res.render('registration.html')
    })

  /////////////////
  // login route //
  /////////////////
  app.route('/login')
    .get((req, res) => {
      res.render('login.html')
    })

  /////////////////
  // store route //
  /////////////////
  app.route('/store')
    .get((req, res) => {
      res.render('store.html')
    })
}