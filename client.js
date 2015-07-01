var net = require('net');
var PORT = 6969;
var HOST = '0.0.0.0';
var FILE_NAME = 'server.log';

var socket = net.Socket({
  readable: true,
  writable: true
});


process.stdin.pipe(socket);


socket.connect(PORT);
socket.write('string for now \n');
socket.end();