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
      res.render('index.ejs')
    })

  /////////////////
  // login route //
  /////////////////
  app.route('/login')
    .get((req, res) => {
      res.render('signin.ejs')
    })

  ////////////////////////
  // registration route //
  ////////////////////////
  app.route('/register')
   .get((req, res) => {
     res.render('registration.ejs')
   })

  /////////////////
  // store route //
  /////////////////
  app.route('/store')
    .get((req, res) => {
      res.render('store.ejs')
    })

  ///////////////////
  // library route //
  ///////////////////
  app.route('/library')
    .get((req, res) => {
      res.render('library.ejs')
    })

  ///////////////////
  // profile route //
  ///////////////////
  app.route('/profile')
    .get((req, res) => {
      res.render('profile.ejs')
    })

  ////////////////
  // game route //
  ////////////////
  app.route('games/:id')
   .get((req, res) => {
     res.render('game.html')
   })
}
