var fs = require('fs'),
	uws = require('uws'),
	http = require('http'),
	https = require('https');


var sslCerl = {
	key: fs.readFileSync('SSL_cert/domain-key.txt'),
	cert: fs.readFileSync('SSL_cert/domain-crt.txt')
}

var server = https.createServer(sslCerl, (req,res)=>{
	res.end(fs.readFileSync('index.html'));
}).listen(443);

var wss = new uws.Server({server: server, port: 3000});

//return AMCE_reponse{ "text": <responseText>} if the request is a ACME challenge
var AMCE_Challenge = function(req){
	if(req.url == "/.well-known/acme-challenge/XD0ccAIWW4MHFr7cBQ_pTD7Y1r0dDSzT9Wiy36m2Ejw")
		return { text:
		 "XD0ccAIWW4MHFr7cBQ_pTD7Y1r0dDSzT9Wiy36m2Ejw.wTz1G0JCJRVKSFedh2VPiCGquf2YwBfr0Ega2C0FQH0"};
	if(req.url == "/.well-known/acme-challenge/QFyek2FGSTU3BKDxNQ7MglBQ4auN9bS9idejPffpmdw")
		return { text: 
		 "QFyek2FGSTU3BKDxNQ7MglBQ4auN9bS9idejPffpmdw.wTz1G0JCJRVKSFedh2VPiCGquf2YwBfr0Ega2C0FQH0"};
	return null;
}

http.createServer((req, res) => {
	console.log(req.url);
	var challenge = AMCE_Challenge(req);
	if(challenge){
		res.end(challenge.text);
	}
	else{
		//redirect to HTTPS
		res.writeHead(301,{
			'Location' : 'https://xseed.tech'
		});
		res.end();
	}

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
	wss.clients.forEach((client)=>{
		if(client === me || client.readyState !== uws.OPEN) return;
		console.log('delUser');
		client.send(JSON.stringify({
			deleteUser : true,
			user: usersMap.get(me)
		}));
	});
});

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

