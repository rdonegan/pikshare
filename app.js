var express = require("express");
var app = express();
var morgan = require('morgan');
var route = require('./routes/serverSocket.js');

// Log requests
app.use(morgan('tiny'));

// load static pages
app.use(express.static(__dirname + '/public'));

//USE THIS TO GET INFO FROM THE DATABASE WITHOUT PRESSING ANYTHING
// app.get('/', dbRoutes.index);

// app.get('/', function(req, res) { return res.send("hello")});
//initialize socket.io
var httpServer = require('http').Server(app);
var sio =require('socket.io');
var io = sio(httpServer);

// httpServer.get('/', route.updateDB);

httpServer.listen(8000, function() {console.log('Listening on 50000');});


var serverSockets = require('./routes/serverSocket.js');
serverSockets.init(io);
