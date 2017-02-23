var fs = require('fs'),
	uws = require('uws');
var wss = new uws.Server({nativeHttp: true, port: 3000}),
	http = require('http');

server = http.createServer((req, res) => {
	res.end(fs.readFileSync('index.html'));
}).listen(80);
//////////////////END INIT SERVER//////////////////////////

//library
function strMapToObj(strMap) {
	let obj = Object.create(null);
    for (let [k,v] of strMap) {
        obj[k] = v;
    }
    return obj;
}


var exampleUser = 
{'Linh Tran' : {peerId: '1io340a4i6hh8b3c'}};
var usersMap = new Map();

var processMessage = function(s, m){
	m = JSON.parse(m);
	if(m.newUser){
		if(usersMap.has(m.user.name)){
			s.send(JSON.stringify({
				userExisted: true,
				name: m.user.name
			}));
		}
		else{
			usersMap.set(m.user.name, m.user.peerId);
			console.log("registerSuccess");
			s.send(JSON.stringify({
				registerSuccess: true,
				name: m.user.name
			}));
			wss.clients.forEach(
			(peer)=>{
				if(peer === s || peer.readyState !== uws.OPEN) return;
				console.log("addUser");
				peer.send(JSON.stringify({
					addUser: true,
					user: m.user
				}))
			});
		}
		return;
	}
	if(m.getUsersMap){
		s.send(JSON.stringify({
			usersMap : strMapToObj(usersMap)
		}));
	}

}



wss.on('connection', function(socket) {
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

var nameMap = {};
