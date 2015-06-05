var sio = require('socket.io');
var hamster = require('hamster');

var port = 8081;
var io = sio(port);
console.log('listening on *:' + port);
