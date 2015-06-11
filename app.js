var sio = require('socket.io');
var hamster = require('hamster');
var config = require('./config');
var redis = require('redis');
var express = require('express');

var app = express();

hamster.setParams({
    keyID: config.keyID,
    vCode: config.vCode
});

var port = 8081;
var io = sio(port);
console.log('socket.io listening on *:' + port);

io.on('connection', function(socket){
  console.log('a subscriber connected');
});

function subscribe(req, res, next) {
    io.on('connection', function(socket){
      console.log('a subscriber connected');
    });

    res.send('you have successfully connected');
    return next();
}

app.get('/subscribe', subscribe);

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.addres().port;

    console.log('api listening on *:' + port)
});

