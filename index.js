var httpsServer = require('./lib/initHttpsServer')
	libs = require('./lib/config.js')
	connectionService = require('./lib/connectionService.js')
	fs = require('fs')

/*
var ws = require('ws'),
	wss = new ws.Server({server: httpsServer});

libs.wss = wss

//run peer server
// require('peer').PeerServer({
//   port: 9000,
//   ssl: libs.ssl
// });

var roomCtrl = require('./controllers/rooms.js')
//////////////////END INIT SERVER//////////////////////////
var usersMap = new Map();

wss.on('connection', function(socket) {
	// console.log(socket);

	connectionService(socket)
	
	socket.jsend = (thing)=>{
		socket.send(JSON.stringify(thing))
	}

	socket.on('message', (message)=>{
		roomCtrl(socket, JSON.parse(message));
	});

});

// setInterval(function ping() {
//   wss.clients.forEach((s)=>{
//     if (s.isAlive === false) return s.terminate();

//     s.isAlive = false;
//     s.ping('', false, true);
//   });
// }, 10000);

// wss.on('message', ()=>{
// 	console.log('message received!');
// });

wss.on('error', function(error) {
    console.log('Cannot start server!. Error: ' + error);
});

*/