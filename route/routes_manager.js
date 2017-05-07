var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gamestore_database'
});

module.exports = function (app, passport) {

  ['/', '/index', '/signin', '/signup',
  '/featured', '/store', '/library', '/wishlist', '/profile',
  '/featured/:game_id', '/store/:game_id'].forEach((path) => {
    app.route(path)
      .get((req, res) => {
        if (path == '/' || path == '/index') {
          ////////////////
          // home route //
          ////////////////
          res.render('index.ejs')
        } else if (path == '/signin') {
          //////////////////
          // signin route //
          //////////////////
          res.render('signin.ejs')
        } else if (path == '/signup') {
          //////////////////
          // signup route //
          //////////////////
          res.render('signup.ejs')
        } else if (path == '/featured') {
          ////////////////////
          // featured route //
          ////////////////////
          connection.query('SELECT game_id, name, price FROM games WHERE review = 5 AND except_country NOT IN (SELECT country FROM users WHERE user_id = ?)',
          [req.query.user_id],
          (err, result) => {
            res.render('featured.ejs', { user_id: req.query.user_id, games: result })
          })
        } else if (path == '/store') {
          /////////////////
          // store route //
          /////////////////
          connection.query('SELECT game_id, name, price FROM games WHERE except_country NOT IN (SELECT country FROM users WHERE user_id = ?)',
          [req.query.user_id],
          (err, result) => {
            res.render('store.ejs', { user_id: req.query.user_id, games: result })
          })
        } else if (path == '/library') {
          ///////////////////
          // library route //
          ///////////////////
          connection.query('SELECT games.* FROM games LEFT JOIN orders ON games.game_id = orders.game_id WHERE orders.user_id = ? AND games.game_id = orders.game_id',
          [req.query.user_id],
          (err, result) => {
            res.render('store.ejs', { user_id: req.query.user_id, games: result })
            // res.render('library.ejs', { user_id: req.query.user_id, games: result })
          })
        } else if (path == '/wishlist') {
          ////////////////////
          // wishlist route //
          ////////////////////
          connection.query('SELECT games.* FROM games LEFT JOIN orders ON games.game_id = wishlist.game_id WHERE wishlist.user_id = ? AND games.game_id = wishlist.game_id',
          [req.query.user_id],
          (err, result) => {
            // res.render('wishlist.ejs', { user_id: req.query.user_id, games: result })
          })
        } else if (path == '/profile') {
          ///////////////////
          // profile route //
          ///////////////////
          connection.query('SELECT * FROM users WHERE user_id = ?', [req.query.user_id], (err, result) => {
            res.render('profile.ejs', { user: result[0] })
          })
        } else if (path == '/featured/:game_id' || path == '/store/:game_id') {
          ////////////////
          // game route //
          ////////////////
          connection.query('SELECT * FROM games WHERE game_id = ?', [req.params.game_id], (err, result) => {
            res.render('game.ejs', { user_id: req.query.user_id, game: result[0] })
          })
        }
      })
  })

  //////////////////
  // signin route //
  //////////////////
  app.route('/signin')
    .post(passport.authenticate('signin', {
      failureRedirect: '/',
      failureFlash: true
    }),
    (req, res) => {
      res.redirect('/featured/?user_id=' + req.user.user_id)
    })

  //////////////////
  // signup route //
  //////////////////
  app.route('/signup')
    .post(passport.authenticate('signup', {
      failureRedirect: '/',
      failureFlash: true
    }),
    (req, res) => {
      res.redirect('/featured/?user_id' + req,user.user_id)
    })
}
