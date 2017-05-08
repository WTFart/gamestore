var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gamestore_database'
});

module.exports = (app, passport) => {
  ////////////////
  // home route //
  ////////////////
  renderHome = (req, res) => {
    res.render('index.ejs')
  }
  app.get('/', renderHome)
  app.get('/index', renderHome)
  //////////////////
  // signin route //
  //////////////////
  app.post('/signin', passport.authenticate('signin', {
    failureRedirect: '/',
    failureFlash: true
  }),
  (req, res) => {
    connection.query('SELECT store_id FROM stores WHERE country = ?', [req.user.country], (err, result) => {
      res.cookie('store_id', result[0])
      res.cookie('user_id', req.user.user_id)
      res.redirect('/featured')
    })
  })
  //////////////////
  // signup route //
  //////////////////
  app.post('/signup', passport.authenticate('signup', {
    failureRedirect: '/',
    failureFlash: true
  }),
  (req, res) => {
    connection.query('SELECT store_id FROM stores WHERE country = ?', [req.user.country], (err, result) => {
      res.cookie('store_id', result[0])
      res.cookie('user_id', req.user.user_id)
      res.redirect('/featured')
    })
  })
  ////////////////////
  // featured route //
  ////////////////////
  app.get('/featured', (req, res) => {
    connection.query('SELECT * FROM games WHERE review = 5 AND except_country NOT IN (SELECT country FROM stores WHERE store_id = ?) AND game_id NOT IN (SELECT game_id FROM orders WHERE user_id = ?)', [req.cookies.store_id, req.cookies.user_id], (err, result) => {
      res.render('featured.ejs', { user_id: req.cookies.user_id, games: result })
    })
  })
  /////////////////
  // store route //
  /////////////////
  app.get('/store', (req, res) => {
    var sql = 'SELECT * FROM games WHERE except_country NOT IN (SELECT country FROM stores WHERE store_id = ?) AND game_id NOT IN (SELECT game_id FROM orders WHERE user_id = ?)'
    var params = [req.cookies.store_id, req.cookies.user_id]
    if (req.query.search) {
      sql += ' AND name LIKE %?%'
      params.push(req.cookies.user_id)
    }
    connection.query(sql, params, (err, result) => {
      res.render('store.ejs', { user_id: req.cookies.user_id, games: result })
    })
  })
  ///////////////////
  // library route //
  ///////////////////
  app.get('/library', (req, res) => {
    connection.query('SELECT games.* FROM games LEFT JOIN orders ON games.game_id = orders.game_id WHERE orders.user_id = ? AND games.game_id = orders.game_id', [req.cookies.user_id], (err, result) => {
      res.render('library.ejs', { user_id: req.cookies.user_id, games: result })
    })
  })
  ////////////////////
  // wishlist route //
  ////////////////////
  app.get('/wishlist', (req, res) => {
    connection.query('SELECT games.* FROM games LEFT JOIN orders ON games.game_id = wishlist.game_id WHERE wishlist.user_id = ? AND games.game_id = wishlist.game_id', [req.cookies.user_id], (err, result) => {
      res.render('wishlist.ejs', { user_id: req.cookies.user_id, games: result })
    })
  })
  ///////////////////
  // profile route //
  ///////////////////
  app.get('/profile', (req, res) => {
    connection.query('SELECT * FROM users WHERE user_id = ?', [req.cookies.user_id], (err, result) => {
      res.render('profile.ejs', { user: result[0] })
    })
  })
  /////////////////
  // game routes //
  /////////////////
  getGameFromID = (req, res) => {
    connection.query('SELECT * FROM games WHERE game_id = ?', [req.params.game_id], (err, result) => {
      res.render('game.ejs', { user_id: req.cookies.user_id, game: result[0] })
    })
  }
  app.get('/featured/:game_id', getGameFromID)
  app.get('/store/:game_id', getGameFromID)
}
