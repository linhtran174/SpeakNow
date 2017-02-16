var fs = require('fs'),
	uws = require('uws');

var wss = new uws.Server({nativeHttp: true, port: 3000}),
	http = require('http');

server = http.createServer((req, res) => {
	res.end(fs.readFileSync('index.html'));
});
server.listen(80);

wss.on('connection', function(ws) {
    console.log('ok, connection');
});

wss.on('error', function(error) {
    console.log('Cannot start server');
});

var nameMap = {};
