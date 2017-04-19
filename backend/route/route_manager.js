module.exports = (server) => {

    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'gamestore_database'
    });

    connection.connect();

    server.route({
        method: 'GET',
        path:'/', 
        handler: function (request, reply) {
            reply('hello world');
        }
    });

    server.route({
        method: 'GET',
        path: '/test',
        handler: function(request, reply) {
            connection.query('SELECT * FROM stores', function(err, result) {
                if (err) throw err;
                reply('The country is: ' + result[1].country)
                
            });
        }
    })
    // connection.end();

    
}
