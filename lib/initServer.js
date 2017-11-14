var fs = require('fs'),
	http = require('http'),
	https = require('https');

var sslCerl = {
	key: fs.readFileSync('/etc/letsencrypt/live/xseed.tech/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/xseed.tech/cert.pem')
}

var config = require('config.js')
var libs = {
	db : require('mysql').createConnection(config.database)
}

// var demoPage = fs.readFileSync('pages/demo.html');
var receptionPage = fs.readFileSync('pages/reception.html');
var signupController = require('controllers/signup.js');
var loginController = require('controllers/login.js');
var browserLib = fs.readFileSync('lib/browserLib.js');


var server = https.createServer(sslCerl, (req,res)=>{
	// if(req.url == '/demo')
	// 	res.end(demoPage);

	if(req.url == '/reception')
		res.end(receptionPage);

	if(req.url == '/signup')
		signupController(req, res, libs);

	if(req.url == '/login')
		loginController(req, res, libs);

	if(req.url == '/browserLib')
		res.end(browserLib);
	
	else
		res.end(receptionPage);

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
