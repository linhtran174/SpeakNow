var fs = require('fs'),
	http = require('http'),
	https = require('https'),
	shortid = require('shortid'),
 	libs = require('./config.js');

// var demoPage = fs.readFileSync('pages/demo.html');
var receptionPage = fs.readFileSync('pages/reception.html');
var signupController = require('./../controllers/signup.js');
var loginController = require('./../controllers/login.js');
var interviewsController = require('./../controllers/interviews.js');
var usersController = require('./../controllers/users.js');
var browserLib = fs.readFileSync('lib/browserLib.js');

var ieltsTests = require('./../controllers/ieltsTests.js');
// var serveStatic = require('./../libs/serveStatic.js')

var ui = {
	loadingIcon : fs.readFileSync('static_https/loading.svg'),
}

var server = https.createServer(libs.ssl, (req,res)=>{
	// if(req.url == '/demo')
	// 	res.end(demoPage);
	console.log(req.url);
	req.data = {}
	if(req.headers.xseeddata)
		req.data = JSON.parse(req.headers.xseeddata)

	res.send = (thing)=>{
		res.end(JSON.stringify(thing))
	}

	switch(req.url.split('/')[1]){
		case 'reception':
		res.end(receptionPage);
		break;

		case 'users':
		usersController(req, res);
		break;

		case 'browserLib':
		res.end(browserLib);
		break;

		// case '/ui/loadingIcon.svg':
		// res.end(ui.loadingIcon);
		// break;

		case 'interviews':
		interviewsController(req, res);
		break;

		case 'ieltsTests':
		ieltsTests(req, res);

		// case '/ui/bell':
		// res.end(ui.bell)


		default: res.end(receptionPage);
	}
	
}).listen(443);

// var router = {
// 	trie: {},
// 	route : function(req, res){
// 		var i = 0
// 		var node = trie[req.url[i]]
// 		while(node[req.url[++i]]){
// 			node 
// 		}
// 	},
// 	add : function(endPoint, callback){
// 		var i = 0;
// 		var node = trie[endPoint[i]]
// 		while(node)
// 			node = node[endPoint[++i]]
// 		node = { l1nH : callback}
// 	}
// }

// router.add('reception', ()=>{})

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
