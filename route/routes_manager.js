var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gamestore_database'
});

module.exports = (app, passport) => {
  /////////////////////
  // utility methods //
  /////////////////////
  setCookies = (req, res) => {
    res.cookie('store_id', req.cookies.store_id)
    res.cookie('user_id', req.cookies.user_id)
    res.cookie('username', req.cookies.username)
  }
  clearCookies = (res) => {
    res.clearCookie('store_id')
    res.clearCookie('user_id')
    res.clearCookie('username')
    res.clearCookie('search')
    res.clearCookie('sort_by')
  }
  clearBuyGameCookies = (res) => {
    res.clearCookie('game_id')
    res.clearCookie('payment_id')
  }
  signIn = (req, res) => {
    connection.query('SELECT store_id FROM stores WHERE country = ?', [req.user.country], (err, result) => {
      clearCookies(res)
      res.cookie('store_id', result[0].store_id)
      res.cookie('user_id', req.user.user_id)
      res.cookie('username', req.user.username)
      res.redirect('/featured')
    })
  }
  searchGames = (req, res, sql, params, page) => {
    setCookies(req, res)
    clearBuyGameCookies(res)
    if (req.query.search || req.cookies.search && req.cookies.search != '') {
      if (req.query.search != '') {
        if (req.query.search && req.query.search != req.cookies.search || !req.cookies.search) {
          res.cookie('search', req.query.search)
        }
        sql += ' AND name LIKE ?'
        params.push('%' + ((req.query.search) ? req.query.search : req.cookies.search) + '%')
      } else {
        res.clearCookie('search')
      }
    }
    if (req.cookies.sort_by && req.cookies.sort_by != 'number') {
      sql += ' ORDER BY ' + req.cookies.sort_by
    }
    connection.query(sql, params, (err, result) => {
      res.render(page, {
        user_id: req.cookies.user_id,
        games: result,
        search: (req.query.search) ? req.query.search : ((req.query.search == '') ?  '' : req.cookies.search),
        username: req.cookies.username
      })
    })
  }
  getGame = (req, res, page) => {
    connection.query('SELECT * FROM games WHERE game_id = ?', [req.params.game_id], (err, result1) => {
      connection.query('SELECT * FROM publishers WHERE publisher_id = ?', [result1[0].publisher], (err, result2) => {
        connection.query('SELECT * FROM developers WHERE developer_id = ?', [result1[0].developer], (err, result3) => {
          res.render(page, {
            user_id: req.cookies.user_id,
            username: req.cookies.username,
            game: result1[0],
            publisher: result2[0],
            developer: result3[0]
          })
        })
      })
    })
  }
  sortBy = (req, res, route) => {
    res.cookie('sort_by', req.params.by)
    res.redirect(route)
  }
  ////////////////
  // home route //
  ////////////////
  app.get('/', (req, res) => {
    var sql = 'SELECT * FROM games ORDER BY '
    if (req.cookies.sort_by) {
      sql += req.cookies.sort_by + ' DESC '
      res.clearCookie('sort_by')
    } else {
      sql += 'RAND() '
    }
    sql += 'LIMIT 6'
    connection.query(sql, (err, result) => {
      clearCookies(res)
      clearBuyGameCookies(res)
      res.render('index.ejs', { games: result })
    })
  })
  //////////////////
  // signin route //
  //////////////////
  app.post('/signin', passport.authenticate('signin', {
    failureRedirect: '/',
    failureFlash: true
  }), signIn)
  //////////////////
  // signup route //
  //////////////////
  app.post('/signup', passport.authenticate('signup', {
    failureRedirect: '/',
    failureFlash: true
  }), signIn)
  ///////////////////
  // signout route //
  ///////////////////
  app.get('/signout', (req, res) => {
    clearCookies(res)
    clearBuyGameCookies(res)
    res.redirect('/')
  })
  ////////////////////
  // featured route //
  ////////////////////
  app.get('/featured', (req, res) => {
    searchGames(req, res,
      'SELECT * FROM games ' + 
      'WHERE review = 5 ' +
      'AND except_country NOT IN ' +
        '(SELECT country FROM stores WHERE store_id = ?) ' +
      'AND game_id NOT IN ' +
        '(SELECT game_id FROM orders WHERE user_id = ?) ' +
      'AND age_limit <= ALL(SELECT age FROM users WHERE user_id = ?)',
      [req.cookies.store_id, req.cookies.user_id, req.cookies.user_id],
      'featured.ejs')
  })
  /////////////////
  // store route //
  /////////////////
  app.get('/store', (req, res) => {
    searchGames(req, res,
      'SELECT * FROM games ' +
      'WHERE except_country NOT IN ' +
        '(SELECT country FROM stores WHERE store_id = ?) ' +
      'AND game_id NOT IN ' +
        '(SELECT game_id FROM orders WHERE user_id = ?) ' +
      'AND age_limit <= ALL(SELECT age FROM users WHERE user_id = ?)',
      [req.cookies.store_id, req.cookies.user_id, req.cookies.user_id],
      'store.ejs')
  })
  ///////////////////
  // library route //
  ///////////////////
  app.get('/library', (req, res) => {
    searchGames(req, res,
      'SELECT games.* FROM games ' +
      'LEFT JOIN orders ON games.game_id = orders.game_id ' +
      'WHERE orders.user_id = ? ' +
      'AND games.game_id = orders.game_id',
      [req.cookies.user_id],
      'library.ejs')
  })
  /////////////////////
  // wishlist routes //
  /////////////////////
  app.get('/wishlist', (req, res) => {
    searchGames(req, res,
      'SELECT games.* FROM games ' +
      'LEFT JOIN wishlists ON games.game_id = wishlists.game_id ' +
      'WHERE wishlists.user_id = ? ' +
      'AND games.game_id = wishlists.game_id',
      [req.cookies.user_id],
      'wishlist.ejs')
  })
  app.get('/wishlist/add/:game_id', (req, res) => {
    connection.query('INSERT INTO wishlists (user_id, game_id, date) VALUES (?,?,NOW())', [req.cookies.user_id, req.params.game_id], (err, result) => {
      res.redirect('/wishlist')
    })
  })
  app.get('/wishlist/remove/:game_id', (req, res) => {
    connection.query('DELETE FROM wishlists WHERE user_id = ? AND game_id = ?', [req.cookies.user_id, req.params.game_id], (err, result) => {
      res.redirect('/wishlist')
    })
  })
  ///////////////////
  // profile route //
  ///////////////////
  app.get('/profile', (req, res) => {
    setCookies(req, res)
    clearBuyGameCookies(res)
    connection.query('SELECT * FROM users WHERE user_id = ?', [req.cookies.user_id], (err, result) => {
      res.render('profile.ejs', { user: result[0], user_id: result[0].user_id, username: result[0].username })
    })
  })
  /////////////////
  // game routes //
  /////////////////
  app.get('/store/:game_id', (req, res) => {
    connection.query(
      'SELECT games.* FROM games ' +
      'LEFT JOIN wishlists ON games.game_id = wishlists.game_id ' +
      'WHERE wishlists.user_id = ? ' +
      'AND wishlists.game_id = ?',
      [req.cookies.user_id, req.params.game_id], (err, result) => {
      setCookies(req, res)
      clearBuyGameCookies(res)
      if (result[0]) {
        res.redirect('/wish/' + req.params.game_id)
      } else {
        res.redirect('/games/' + req.params.game_id)
      }
    })
  })
  app.get('/games/:game_id', (req, res) => {
    setCookies(req, res)
    clearBuyGameCookies(res)
    getGame(req, res, 'game.ejs')
  })
  app.get('/owns/:game_id', (req, res) => {
    setCookies(req, res)
    clearBuyGameCookies(res)
    getGame(req, res, 'own.ejs')
  })
  app.get('/wish/:game_id', (req, res) => {
    setCookies(req, res)
    clearBuyGameCookies(res)
    getGame(req, res, 'wish.ejs')
  })
  ////////////////////
  // payment routes //
  ////////////////////
  app.get('/payment', (req, res) => {
    setCookies(req, res)
    res.cookie('game_id', req.cookies.game_id)
    res.render('new_payment.ejs', { user_id: req.cookies.user_id, username: req.cookies.username })
  })
  app.get('/payment/buy/:game_id', (req, res) => {
    setCookies(req, res)
    connection.query('SELECT name, surname FROM users WHERE user_id = ?', [req.cookies.user_id], (err, user) => {
      connection.query('SELECT * FROM games WHERE game_id = ?', [req.params.game_id], (err, result1) => {
        connection.query('SELECT * FROM payments WHERE user_id = ? AND valid = TRUE LIMIT 1', [req.cookies.user_id], (err, result2) => {
          res.cookie('game_id', req.params.game_id)
          if (result2[0]) {
            res.cookie('payment_id', result2[0].payment_id)
            res.render('payment.ejs', { game: result1[0], payments: result2, user_id: req.cookies.user_id, username: req.cookies.username, name: user[0].name, surname: user[0].surname })
          } else {
            res.redirect('/payment')
          }
        })
      })
    })
  })
  app.get('/payment/checkout', (req, res) => {
    connection.query('SELECT price FROM games WHERE game_id = ?', [req.cookies.game_id], (err, price) => {
      connection.query('INSERT INTO orders (user_id, game_id, price, payment_id, date) VALUES (?,?,?,?,NOW())', [req.cookies.user_id, req.cookies.game_id, price[0].price, req.cookies.payment_id], (err, result) => {
        setCookies(req, res)
        clearBuyGameCookies(res)
        res.redirect('/library')
      })
    })
  })
  app.post('/payment/new', (req, res) => {
    setCookies(req, res)
    if (req.body.payment_type && req.body.card_number_1 && req.body.card_number_2 && req.body.card_number_3 && req.body.card_number_4) {
      connection.query('INSERT INTO payments (user_id, payment_type, card_number, valid) VALUES (?,?,?,TRUE)', [req.cookies.user_id, req.body.payment_type, req.body.card_number_1 + req.body.card_number_2 + req.body.card_number_3 + req.body.card_number_4], (err, result) => {
        if (req.cookies.game_id && req.cookies.game_id != "undefined") {
          res.redirect('/payment/buy/' + req.cookies.game_id)
        } else {
          res.redirect('/profile')
        }
      })
    } else {
      res.redirect('/payment')
    }
  })
  ////////////////////
  // utility routes //
  ////////////////////
  app.get('/sort/:by', (req, res) => {
    sortBy(req, res, '/')
  })
  app.get('/featured/sort/:by', (req, res) => {
    sortBy(req, res, '/featured')
  })
  app.get('/store/sort/:by', (req, res) => {
    sortBy(req, res, '/store')
  })
  app.get('/library/sort/:by', (req, res) => {
    sortBy(req, res, '/library')
  })
  app.get('/wishlist/sort/:by', (req, res) => {
    sortBy(req, res, '/wishlist')
  })
}
