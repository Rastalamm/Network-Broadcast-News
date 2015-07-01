var net = require('net');
var PORT = 6969;
var HOST = '0.0.0.0';
var FILE_NAME = 'server.log';
var clientConnectedList = {};

function clientConnected (socket) {

//welcome message
  socket.write('welcome! PLease play nice');

  clientConnectedList[socket.remotePort] = socket;

  console.log(Object.keys(clientConnectedList));

  process.stdout.write('CONNECTED: ' + socket.remoteAddress +":"+ socket.remotePort + '\n');

  //this is what the server sees
  socket.on('data', function(data){
    process.stdout.write('SERVER BCAST FROM '+ socket.remoteAddress +":"+ socket.remotePort + ': ' )
    process.stdout.write(data);
    process.stdout.write('\n');

  })

//this is what the clients see
  socket.on('data', function(data){
    for (key in clientConnectedList){
      clientConnectedList[key].write('user: ' + key + ': ' + data + '\n')
    }
  })

  socket.on('end', function() {
    console.log('client disconnected', socket._peername.port);
  });



}

var server = net.createServer(clientConnected);

server.listen(PORT, HOST, function() { //'listening' listener
  process.stdout.write('Server Listening on ' + HOST + ':' + PORT + '\n');

});