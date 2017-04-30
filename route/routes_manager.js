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

  //////////////////
  // signin route //
  //////////////////
  app.route('/signin')
    .get((req, res) => {
      res.render('signin.ejs')
    })

  //////////////////
  // signup route //
  //////////////////
  app.route('/signup')
   .get((req, res) => {
     res.render('signup.ejs')
   })

  /////////////////
  // store route //
  /////////////////
  app.route('/store')
    .get((req, res) => {
      connection.query('SELECT game_id, name, price FROM games', (err, result) => {
        // games[0].game_id
        // games[1].name
        // games[2].price
        res.render('store.ejs', { games: result })
      })
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
