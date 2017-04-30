var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Store'
});
module.exports = function (app) {
  
  ////////////////////
  // default route  //
  ////////////////////
  app.route('/')
    .get((req, res) => {
      return res.status(200).json({
        message: 'Hello World! yahoo'
      })
    })
}