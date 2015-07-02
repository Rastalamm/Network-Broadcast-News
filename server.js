var net = require('net');
var PORT = 6969;
var HOST = '0.0.0.0';
var FILE_NAME = 'server.log';
var clientConnectedList = {};
var usernameList = [];


var server = net.createServer(onConnect);
server.listen(PORT, HOST, function() { //'listening' listener
  process.stdout.write('Server Listening on ' + HOST + ':' + PORT + '\n');
});


function dataListener(socket){

  socket.on('data', function(data){

    if(clientConnectedList[socket.remotePort].username === null){
      userNameCheck(socket, data);
    }else{
      console.log('anything');
      writeMessages(socket, data);
    }

  })



  socket.on('end', function(data){
   userExits(socket);
  });


}



function onConnect(socket, data){
  socket.setEncoding('utf8');
  dataListener(socket, data);
  storeUserInfo(socket, data);
  adminMessageOut(socket, data);
  socket.write('Please enter a Username to begin: \n');

}

//adds the clients port # to the connected list object
function storeUserInfo(socket){
  clientConnectedList[socket.remotePort] = socket;
  clientConnectedList[socket.remotePort].username = null;

}


function userNameCheck(socket, data){

  if( data.substring(0, data.length-1) === 'admin' || data.substring(0, data.length-1) === "" || usernameList.indexOf(data.substring(0, data.length-1)) > -1  ){
      socket.write('That\'s a good username! Too bad though, another user has it! \n');
      socket.write('Please enter an even better Username \n');
    }else{
      usernameAssign(socket, data);
    }

}

function usernameAssign(socket, data){

  clientConnectedList[socket.remotePort].username = data.substring(0, data.length-1);
  usernameList.push(data.substring(0, data.length-1));
  process.stdout.write('New Username: '+ clientConnectedList[socket.remotePort].username + '\n');
  socket.write('Hey ' + clientConnectedList[socket.remotePort].username + '! What is the first word that comes to mind? \n');
  console.log('list of current Usernames', usernameList);
}



function writeMessages(socket, data){

  //username is unique
  process.stdout.write('SERVER BCAST FROM '+ clientConnectedList[socket.remotePort].username + ': ' + data + '\n');

  // this is what the clients see
  for (key in clientConnectedList){
    clientConnectedList[key].write(clientConnectedList[socket.remotePort].username + ': ' + data)
  }
}



  // //Keeps tracks
  // process.stdout.write('New Client: ' + socket.remoteAddress +":"+ socket.remotePort + '\n');
  // console.log('List of Users connected', Object.keys(clientConnectedList));



function userExits(socket, data){
    if(usernameList.indexOf(clientConnectedList[socket._peername.port].username) > -1){
      usernameList.splice(usernameList.indexOf(clientConnectedList[socket._peername.port].username),1);
    }
    delete clientConnectedList[socket._peername.port]
    console.log('client disconnected', socket._peername.port);
    console.log('list of current Usernames', usernameList);
}


function adminMessageOut(socket, data){

//admin writes to all
  process.stdin.on('data', function(c){



    socket.write('ADMIN says' +  ': ' + c );
  })

}





