module.exports = (server) => {

    server.route({
        method: 'GET',
        path:'/hello', 
        handler: function (request, reply) {
            return reply('hello world');
        }
    });
    
}
