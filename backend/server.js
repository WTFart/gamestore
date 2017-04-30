const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cors())
app.listen(3000);
console.log('Store@ http://localhost:' + 3000);

app.route('/test')
  .get((req, res) => {
    return res.status(200).json({
      message: 'Hello World!'
    })
  })
  
var mysql      = require('mysql');
 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '',
   database : 'Store'
 });