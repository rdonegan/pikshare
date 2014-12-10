var express = require("express");
var app = express();
var morgan = require('morgan');
var route = require('./routes/serverSocket.js');
var path = require('path');


var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 50000;

// Log requests
app.use(morgan('tiny'));

// load static pages
app.use(express.static(__dirname + '/public'));

//initialize socket.io
var httpServer = require('http').Server(app);
var sio =require('socket.io');
var io = sio.listen(httpServer);//(httpServer);

// httpServer.get('/', route.updateDB);

httpServer.listen(port, ipaddress);


var serverSockets = require('./routes/serverSocket.js');
serverSockets.init(io);

