var net = require('net');
var PORT = 6969;
var HOST = '0.0.0.0';
var FILE_NAME = 'server.log';
// var clientConnectedList = {};
var clientConnectedList = require('./cclist.js')();
var blackList = ['admin', 'ADMIN'];
var usernameList = [];
var commandList = {126 : '~kick'};


var server = net.createServer(onConnect);
server.listen(PORT, HOST, function() { //'listening' listener
  process.stdout.write('Server Listening on ' + HOST + ':' + PORT + '\n');
});


function dataListener(socket){

  socket.on('data', function(data){

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
  socket.write('Please enter a Username to begin: \n');

}

//adds the clients port # to the connected list object
function storeUserInfo(socket, data){
  clientConnectedList[socket.remotePort] = socket;
  clientConnectedList[socket.remotePort].username = null;

}


function userNameCheck(socket, data){

  if(blackList.indexOf(data.substring(0, data.length-1)) > -1 ){
    socket.write('Illegal entry! Please reconnect \n');
    socket.end();
  }else{
    //checks for duplicates
    if(usernameList.indexOf(data.substring(0, data.length-1)) > -1  ){
      socket.write('That\'s a good username! Too bad though, another user has it! \n');
      socket.write('Please enter an even better Username \n');
    }else{
      if(data.substring(0, data.length-1) === ''){
          socket.write('You need a username! \n');
          socket.write('Please enter an Username \n');
      }else{
        //checks for spaces
        if(data.substring(0, data.length-1).indexOf(' ') > -1){
          socket.write('Usernames are spaceless.. \n');
          socket.write('Please enter an Username \n');
        }else{
          usernameAssign(socket, data);
        }
      }
    }
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
  // for (key in clientConnectedList){
  //   clientConnectedList[key].write(clientConnectedList[socket.remotePort].username + ': ' + data)
  // }
}

function userExits(socket, data){
    if(usernameList.indexOf(clientConnectedList[socket._peername.port].username) > -1){
      usernameList.splice(usernameList.indexOf(clientConnectedList[socket._peername.port].username),1);
    }
    delete clientConnectedList[socket._peername.port]
    console.log('\n client disconnected', socket._peername.port);
    console.log('list of current Users', usernameList);
}


(function adminMessageOut(){
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function(data){

  data = data.substring(0, data.length-1);

    if(data.substring(0,1) === '~'){

      input = data.split(' ');
      command = input[0];
      user = input[1];


      commands(input, command, user);
    }else{
      adminWriteOut(data)
    }
  })

})();

function adminWriteOut(data){

  data = data;

  var portArr = Object.keys(clientConnectedList);

  portArr.forEach(function(element){
    clientConnectedList[element].write('ADMIN says' +  ': ' + data + '\n');
  });

}


function commands(input, command, user){

  switch(command){
    case '~kick':
      findUserByUserName(user);
    break;

    case '~userlist':
      console.log('Current Users', usernameList);
    break;

    default:
      //some code
    break;

  }

}


function findUserByUserName(user){

  console.log('call this');

  for(key in clientConnectedList){

    if(clientConnectedList[key].username === user){

      blackList.push(clientConnectedList[key].username);
      clientConnectedList[key].end('Off with your head!');
      console.log('The naughty list', blackList);
    }

  }



}

