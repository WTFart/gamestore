module.exports = (server) => {

    server.route({
        method: 'GET',
        path:'/', 
        handler: function (request, reply) {
            return reply('hello world');
        }
    });
    
}
