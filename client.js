var net = require('net');
var PORT = 6969;
var HOST = '0.0.0.0';
var FILE_NAME = 'server.log';

var socket = net.Socket({
  readable: true,
  writable: true
});

socket.connect(PORT);
socket.setDefaultEncoding('utf8');
socket.write('string for now');
socket.end();