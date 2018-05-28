var fs = require('fs'),
	http = require('http'),
	https = require('https'),
	shortid = require('shortid'),
 	libs = require('./config.js');

// var demoPage = fs.readFileSync('pages/demo.html');
var receptionPage = fs.readFileSync('pages/reception.html');
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
	// console.log(req.url);
	req.data = {}
	if(req.headers.xseeddata)
		req.data = JSON.parse(req.headers.xseeddata)

	res.send = (thing)=>{
		res.end(JSON.stringify(thing))
	}

	switch(req.url.split('/')[1]){
		case 'ieltsTests':
		ieltsTests(req, res);
		break;

		case '':
		res.end(receptionPage);
		break;

		case 'loaderio-d07fd72f7afbcce7cd2df5adf12cf0b9.txt':
		res.end("loaderio-d07fd72f7afbcce7cd2df5adf12cf0b9");
		break;

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

		// case '/ui/bell':
		// res.end(ui.bell)

		default: res.end();
	}
	
})

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
	// if(req.url == "/loaderio-e1c988cd7e7da5fa5ed34beb83d66e4e/") 
	// res.end("loaderio-e1c988cd7e7da5fa5ed34beb83d66e4e");
	if(req.url == "/.well-known/acme-challenge/XD0ccAIWW4MHFr7cBQ_pTD7Y1r0dDSzT9Wiy36m2Ejw")
	res.end("XD0ccAIWW4MHFr7cBQ_pTD7Y1r0dDSzT9Wiy36m2Ejw.wTz1G0JCJRVKSFedh2VPiCGquf2YwBfr0Ega2C0FQH0");
	if(req.url == "/.well-known/acme-challenge/QFyek2FGSTU3BKDxNQ7MglBQ4auN9bS9idejPffpmdw")
	res.end("QFyek2FGSTU3BKDxNQ7MglBQ4auN9bS9idejPffpmdw.wTz1G0JCJRVKSFedh2VPiCGquf2YwBfr0Ega2C0FQH0");
}

// http.createServer((req, res) => {
// 	AMCE_Challenge(req, res);
// 	//redirect to HTTPS
// 	//res.end("loaderio-e1c988cd7e7da5fa5ed34beb83d66e4e");
// 	res.writeHead(301,{
// 		'Location' : 'https://xseed.tech'
// 	});
// 	res.end();
// }).listen(3000);

module.exports = function(port){
	return server.listen(port);
};
