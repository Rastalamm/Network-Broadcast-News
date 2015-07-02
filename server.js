var net = require('net');
var PORT = 6969;
var HOST = '0.0.0.0';
var FILE_NAME = 'server.log';
var clientConnectedList = {};
var usernameList = ['admin', 'ADMIN', ''];
var commandList = {126 : '~kick'};


var server = net.createServer(onConnect);
server.listen(PORT, HOST, function() { //'listening' listener
  process.stdout.write('Server Listening on ' + HOST + ':' + PORT + '\n');
});


function dataListener(socket){

  socket.on('data', function(data){
    //validates a username exists

    if(clientConnectedList[socket.remotePort].username === null){
      userNameCheck(socket, data);
    }else{
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

  if(usernameList.indexOf(data.substring(0, data.length-1)) > -1  ){
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
  console.log('list of current Users', usernameList);
}



function writeMessages(socket, data){

  //writes messages to the server/admin
  process.stdout.write('SERVER BCAST FROM '+ clientConnectedList[socket.remotePort].username + ': ' + data + '\n');

  //writes messages to the clients
  for (key in clientConnectedList){
    clientConnectedList[key].write(clientConnectedList[socket.remotePort].username + ': ' + data)
  }
}

function userExits(socket, data){
    if(usernameList.indexOf(clientConnectedList[socket._peername.port].username) > -1){
      usernameList.splice(usernameList.indexOf(clientConnectedList[socket._peername.port].username),1);
    }
    delete clientConnectedList[socket._peername.port]
    console.log('client disconnected', socket._peername.port);
    console.log('list of current Users', usernameList);
}


function adminMessageOut(socket, data){

//admin writes to all
  process.stdin.on('data', function(data){

    if(commandList.hasOwnProperty(data[0])){
      //call the function command
      console.log('a command has been given!');
      commands(socket, data, data[0]);
    }else{

      console.log(data[0]);

      socket.write('ADMIN says' +  ': ' + data );

    }
  })

}

//create a filter for commands
//meabing the first character is a ~ or 126
//substring the command words from the ~
//put ther command word into a swtich and run functions
// each command gets its own function or jsut each swtich


function commands(socket, data, command){
console.log('socket', socket);
console.log('command', command);
process.stdout.write('The data', data);
  // switch(data){

  // }

}




