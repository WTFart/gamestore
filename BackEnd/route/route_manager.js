module.exports = (server) => {

    server.route({
        method: 'GET',
        path:'/hello', 
        handler: function (request, reply) {
            return reply('hello world');
        }
    });

    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'Store'
    });

}
