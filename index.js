var uws = require('uws'),
	http = require('./lib/initServer');

var wss = new uws.Server({server: http, port: 3000});

var fs = require('fs');

//run peer server
require('peer').PeerServer({
  port: 9000,
  ssl: {
    key: fs.readFileSync('SSL_cert/xseed.tech.key'),
    cert: fs.readFileSync('SSL_cert/xseed.tech.crt')
  }
});
//////////////////END INIT SERVER//////////////////////////
var usersMap = new Map();

var processMessage = function(s, m){
	m = JSON.parse(m);
	if(m.newUser){
		if(usersMap.has(s) || usersMap.has(m.user.name)){
			s.send(JSON.stringify({
				userExisted: true,
				name: m.user.name
			}));
		}
		else{
			usersMap.set(s, {name: m.user.name, peerId: m.user.peerId});
			//console.log("registerSuccess");
			s.send(JSON.stringify({
				registerSuccess: true,
				name: m.user.name
			}));
			wss.clients.forEach(
			(peer)=>{
				if(peer === s || peer.readyState !== uws.OPEN) return;
				//console.log("addUser");
				peer.send(JSON.stringify({
					addUser: true,
					user: m.user
				}))
			});
		}
		return;
	}
	if(m.getUserList){
		var userList = [];
		usersMap.forEach((user, socket)=>{
			userList.push(user);
		})
		s.send(JSON.stringify({
			userList : userList
		}));
		return;
	}
}

wss.on('disconnection', (me)=>{
	console.log('disconnection');
	wss.clients.forEach((client)=>{
		if(client === me || client.readyState !== uws.OPEN) return;

		client.send(JSON.stringify({
			deleteUser : true,
			user: usersMap.get(me)
		}));
	});
});



wss.on('connection', function(socket) {
	socket
	socket.on('message', (message)=>{
		processMessage(socket, message);
	});
});

wss.on('message', ()=>{
	console.log('message received!');
});

wss.on('error', function(error) {
    console.log('Cannot start server');
});
