'use strict';

const Hapi = require('hapi');
var Vision = require('vision')

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8384
});

require("./route/route_manager")(server)

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});