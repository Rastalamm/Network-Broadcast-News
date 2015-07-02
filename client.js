var net = require('net');
var PORT = 6969;
var HOST = '0.0.0.0';
var FILE_NAME = 'server.log';

//Const: .30
//Kawika: .3
//Dan: .6
//Jason: .23
//Judah: .24

var socket = net.connect({host : HOST, port : PORT}, connectedToServer);

function connectedToServer(){

  process.stdin.pipe(socket);

  socket.on('data', function(data){
    process.stdout.write(data);
  })



}






// socket.write('string for now \n');
// socket.end();