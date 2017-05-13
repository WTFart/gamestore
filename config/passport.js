var LocalStrategy = require('passport-local').Strategy

var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gamestore_database'
})

module.exports = function(passport) {

  passport.serializeUser((user, done) => {
    done(null, user.user_id)
  })

  passport.deserializeUser((id, done) => {
    connection.query('SELECT * FROM users WHERE user_id = ?', [id], (err, result) => {
      done(err, result[0])
    })
  })

  passport.use('signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    process.nextTick(() => {
      connection.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
          return done(err)
        }
        if (!result[0]) {
          return done(null, false, req.flash('signinMessage', 'No user found.'))
        }
        if (password != result[0].password) {
          return done(null, false, req.flash('signinMessage', 'Wrong password.'))
        } else {
          return done(null, result[0])
        }
      })
    })
  }))

  passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    process.nextTick(() => {
      if (!req.user || !(req.body.name && req.body.surname && req.body.username && password && req.body.gender && req.body.age && email && req.body.country)) {
        connection.query('SELECT user_id FROM users WHERE email = ?', [email], (err, result) => {
          if (err) {
            return done(err)
          }
          if (result[0]) {
            return done(null, false, req.flash('signupMessage', 'Email is already taken.'))
          } else {
            if (req.body.password === req.body.confirmation) {
              connection.query('INSERT INTO users (name, surname, username, password, gender, age, email, country) VALUES (?,?,?,?,?,?,?,?)',
              [req.body.name, req.body.surname, req.body.username, password, req.body.gender, req.body.age, email, req.body.country],
              (err, result) => {
                if (err) {
                  return done(err)
                }
                connection.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
                  return done(null, result[0])
                })
              })
            }
          }
        })
      } else {
        return done(null, req.user)
      }
    })
  }))
}