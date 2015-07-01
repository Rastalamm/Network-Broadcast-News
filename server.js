
var net = require('net');
var PORT = 6969;
var HOST = '0.0.0.0';
var FILE_NAME = 'server.log';




function clientConnected (socket) {

  console.log('client connected');

  socket.on('end', function() {
    console.log('client disconnected');
  });

  socket.on('data', function(data){
    socket.setDefaultEncoding('utf8');
    console.log('data', data);
  })




}

var server = net.createServer(clientConnected);
server.listen(PORT, function() { //'listening' listener
  console.log('server port is', PORT);
});