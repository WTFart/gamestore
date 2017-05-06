var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gamestore_database'
});

module.exports = function (app, passport) {
  ////////////////
  // home route //
  ////////////////
  ['/', '/index'].forEach((path) => {
    app.route(path)
      .get((req, res) => {
        res.render('index.ejs')
      })
  })

  //////////////////
  // signin route //
  //////////////////
  app.route('/signin')
    .get((req, res) => {
      res.render('signin.ejs')
    })

  app.route('/signin')
    .post(passport.authenticate('local-signin', {
      successRedirect: '/featured/1',
      failureRedirect: '/signin',
      failureFlash: true
    }))

  //////////////////
  // signup route //
  //////////////////
  app.route('/signup')
   .get((req, res) => {
     res.render('signup.ejs')
   })

  ////////////////////
  // featured route //
  ////////////////////
  app.route('/featured/:user_id')
   .get((req, res) => {
     connection.query('SELECT game_id, name, price FROM games WHERE review > 4', (err, result) => {
       res.render('featured.ejs', { user_id: req.params.user_id, games: result })
     })
   })

  /////////////////
  // store route //
  /////////////////
  app.route('/store/:user_id')
    .get((req, res) => {
      connection.query('SELECT game_id, name, price FROM games', (err, result) => {
        res.render('store.ejs', { user_id: req.params.user_id, games: result })
      })
    })

  ///////////////////
  // library route //
  ///////////////////
  app.route('/library/:user_id')
    .get((req, res) => {
      res.render('library.ejs', { user_id: req.params.user_id })
    })

  ////////////////////
  // wishlist route //
  ////////////////////
  app.route('/wishlist/:user_id')
   .get((req, res) => {
     res.render('wishlist.ejs', { user_id: req.params.user_id })
   })

  ///////////////////
  // profile route //
  ///////////////////
  app.route('/profile/:user_id')
    .get((req, res) => {
      connection.query('SELECT * FROM users WHERE user_id = ?', [req.params.user_id], (err, result) => {
        res.render('profile.ejs', { user: result[0] })
      })
    })

  ////////////////
  // game route //
  ////////////////
  app.route('/store/:user_id/:game_id')
   .get((req, res) => {
     connection.query("SELECT * FROM games WHERE game_id = ?", [req.params.game_id], (err, result) => {
       res.render('game.ejs', { user_id: req.params.user_id, game: result[0] })
     })
   })
}
