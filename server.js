
var net = require('net');
var PORT = 6969;
var HOST = '0.0.0.0';
var FILE_NAME = 'server.log';

var connectedSockets = [];



function clientConnected (socket) {

  console.log('client connected');
  console.log('port', socket.remotePort);
  console.log('address', socket.remoteAddress);

  connectedSockets.push({
    socket : socket,
    port : socket.remotePort,
    address : socket.remoteAddress })

  console.log('arr', connectedSockets);
  socket.on('end', function() {
    console.log('client disconnected');
  });


  socket.on('data', function(data){

    process.stdout.write(data);

  })




}

var server = net.createServer(clientConnected);

server.listen(PORT, HOST, function() { //'listening' listener
  console.log('server port is', PORT);
});