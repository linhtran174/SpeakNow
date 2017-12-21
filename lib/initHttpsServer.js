var fs = require('fs'),
	http = require('http'),
	https = require('https');
	shortid = require('shortid');

var config = require('./config.js');

var sslCert = {
	key: fs.readFileSync(config.sslCert.key),
	cert: fs.readFileSync(config.sslCert.cert),
	ca: fs.readFileSync(config.sslCert.ca)
}

var libs = {
	db : require('mysql').createConnection(config.database),
	ssl : sslCert,
	uid : shortid
}

// var demoPage = fs.readFileSync('pages/demo.html');
var receptionPage = fs.readFileSync('pages/reception.html');
var signupController = require('./../controllers/signup.js');
var loginController = require('./../controllers/login.js');
var interviewsController = require('./../controllers/interviews.js');
var browserLib = fs.readFileSync('lib/browserLib.js');

var ieltsTests = require('./../controllers/ieltsTests.js');
// var serveStatic = require('./../libs/serveStatic.js')


var ui = {
	loadingIcon : fs.readFileSync('static_https/loading.svg'),
}

var server = https.createServer(sslCert, (req,res)=>{
	// if(req.url == '/demo')
	// 	res.end(demoPage);
	console.log(req.url);

	res.send = (thing)=>{
		res.end(JSON.stringify(thing))
	}

	switch(req.url){
		case '/reception':
		res.end(receptionPage);
		break;

		case '/signup':
		signupController(req, res, libs);
		break;

		case '/login':
		loginController(req, res, libs);
		break;

		case '/browserLib':
		res.end(browserLib);
		break;

		// case '/ui/loadingIcon.svg':
		// res.end(ui.loadingIcon);
		// break;

		case '/interviews':
		interviewsController(req, res, libs);
		break;

		// case '/ui/bell':
		// res.end(ui.bell)


		default: res.end(receptionPage);
	}
	
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
