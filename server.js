var net = require('net');
var PORT = 6969;
var HOST = '0.0.0.0';
var FILE_NAME = 'server.log';

var connectedSockets = [];



function clientConnected (socket) {

  // console.log('client connected');
  // console.log('port', socket.remotePort);
  // console.log('address', socket.remoteAddress);


  process.stdout.write('CONNECTED: ' + socket.remoteAddress +":"+ socket.remotePort + '\n');

  connectedSockets.push({
    socket : socket,
    port : socket.remotePort,
    address : socket.remoteAddress })

  socket.on('data', function(data){
    process.stdout.write('SERVER BCAST FROM '+ socket.remoteAddress +":"+ socket.remotePort + ': ' )
    process.stdout.write(data);
    process.stdout.write('\n');
    // process.stdin.pipe(socket);
  })

  socket.on('data', function(data){
    socket.write(data);
  })

//loop through socket array and write to each of them

    socket.on('end', function() {
    console.log('client disconnected');
  });



}

var server = net.createServer(clientConnected);

server.listen(PORT, HOST, function() { //'listening' listener
  process.stdout.write('Server Listening on ' + HOST + ':' + PORT + '\n');

});