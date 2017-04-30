const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')
const path = require('path')
app.use(bodyParser.urlencoded({
  extended: false
}));
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(express.static(path.join(__dirname, 'views')))
app.use(bodyParser.json());
app.use(cors())
app.listen(3000);
console.log('Store@ http://localhost:' + 3000);

require('./route/routes_manager.js')(app);
