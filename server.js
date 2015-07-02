var net = require('net');
var PORT = 6969;
var HOST = '0.0.0.0';
var FILE_NAME = 'server.log';
var clientConnectedList = {};
var usernameList = [];


var server = net.createServer(clientConnected);

server.listen(PORT, HOST, function() { //'listening' listener
  process.stdout.write('Server Listening on ' + HOST + ':' + PORT + '\n');
});

function adminActions(){
  console.log('client disconnected');
}

function userNameCheck(socket){

}

function usernameAssign(socket){

}




function clientConnected (socket) {
  socket.setEncoding('utf8');

//welcome message for the client
  socket.write('Please enter a Username to begin: \n');

//adds the clients port # to the connected list object
  clientConnectedList[socket.remotePort] = socket;
  clientConnectedList[socket.remotePort].username = null;

  //Keeps tracks
  process.stdout.write('New Client: ' + socket.remoteAddress +":"+ socket.remotePort + '\n');
  console.log('List of Users connected', Object.keys(clientConnectedList));

  //sets the UN and/or writes the info to the server
  socket.on('data', function(data){
  //if no username is set
    if(clientConnectedList[socket.remotePort].username === null){
      //checks to see if the username they want is available
      if( data.substring(0, data.length-1) === 'admin' || data.substring(0, data.length-1) === "" || usernameList.indexOf(data.substring(0, data.length-1)) > -1  ){
        socket.write('That\'s a good username! Too bad though, another user has it! \n');
        socket.write('Please enter an even better Username \n');

       }else{
          //set their username here
          clientConnectedList[socket.remotePort].username = data.substring(0, data.length-1);
          usernameList.push(data.substring(0, data.length-1));
          process.stdout.write('New Username: '+ clientConnectedList[socket.remotePort].username + '\n');
          socket.write('Hey ' + clientConnectedList[socket.remotePort].username + '! What is the first word that comes to mind? \n');
       }
    }else{
      //username is unique
      process.stdout.write('SERVER BCAST FROM '+ clientConnectedList[socket.remotePort].username + ': ' + data + '\n');

      // this is what the clients see
      for (key in clientConnectedList){
        clientConnectedList[key].write(clientConnectedList[socket.remotePort].username + ': ' + data)
      }
    }
  })

//admin writes to all
  process.stdin.on('data', function(c){
    socket.write('ADMIN says' +  ': ' + c );
  })


//removes the socket after the user has left
  socket.on('end', function() {
    if(usernameList.indexOf(clientConnectedList[socket._peername.port].username) > -1){
      usernameList.splice(usernameList.indexOf(clientConnectedList[socket._peername.port]),1);
    }
    delete clientConnectedList[socket._peername.port]
    console.log('client disconnected', socket._peername.port);
    console.log('list of current Usernames', usernameList);
  });

}

