var fs = require('fs'),
	http = require('http'),
	https = require('https');

var sslCerl = {
	key: fs.readFileSync('SSL_cert/xseed.tech.key'),
	cert: fs.readFileSync('SSL_cert/xseed.tech.crt')
}

var server = https.createServer(sslCerl, (req,res)=>{
	res.end(fs.readFileSync('index.html'));
}).listen(443);


var AMCE_Challenge = function(req, res){
	if(req.url == "/.well-known/acme-challenge/XD0ccAIWW4MHFr7cBQ_pTD7Y1r0dDSzT9Wiy36m2Ejw")
	res.end("XD0ccAIWW4MHFr7cBQ_pTD7Y1r0dDSzT9Wiy36m2Ejw.wTz1G0JCJRVKSFedh2VPiCGquf2YwBfr0Ega2C0FQH0");
	if(req.url == "/.well-known/acme-challenge/QFyek2FGSTU3BKDxNQ7MglBQ4auN9bS9idejPffpmdw")
	res.end("QFyek2FGSTU3BKDxNQ7MglBQ4auN9bS9idejPffpmdw.wTz1G0JCJRVKSFedh2VPiCGquf2YwBfr0Ega2C0FQH0");
}

http.createServer((req, res) => {
	AMCE_Challenge(req, res);
	//redirect to HTTPS
	res.writeHead(301,{
		'Location' : 'https://xseed.tech'
	});
	res.end();
}).listen(80);

module.exports = server;
