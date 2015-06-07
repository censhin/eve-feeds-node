var sio = require('socket.io');
var hamster = require('hamster');
var config = required('./config');

hamster.setParams({
    keyID: config.keyID,
    vCode: config.vCode
});

var port = 8081;
var io = sio(port);
console.log('listening on *:' + port);
