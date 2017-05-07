const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const cors = require('cors')
const path = require('path')
app.use(bodyParser.urlencoded({
  extended: false
}));
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(session({
  secret: 'iHateDatabase'
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(express.static(path.join(__dirname, 'views')))
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors())
app.listen(3000);
console.log('Store@ http://localhost:' + 3000);

require('./config/passport')(passport)
require('./route/routes_manager.js')(app, passport);
