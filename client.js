var net = require('net');
var PORT = 6969;
var HOST = '0.0.0.0';
var FILE_NAME = 'server.log';

// var socket = net.Socket({
//   readable: true,
//   writable: true
// });

var socket = net.connect({host : HOST, port : PORT}, connectedToServer);

function connectedToServer(){
  console.log('connected to the server guys');
  process.stdin.pipe(socket);

  socket.on('data', function(data){
    process.stdout.write('SERVER BCAST FROM '+ socket.localAddress +":"+ socket.localPort + ': ' )
    process.stdout.write(data);
  })



}






// socket.write('string for now \n');
// socket.end();