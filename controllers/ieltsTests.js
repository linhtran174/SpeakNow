const libs = require('../lib/config.js')
var tests = require('../testData/tests.js');


module.exports = function(req, res){
	var db = libs.db;
	if(!req.data.token){
		randomTest = tests[randInt(0, tests.length - 1)]
		res.end(JSON.stringify(randomTest))	
	}
	// var wrongCredentialM = {status: "failed", message: "Got problem with your credentials! Please double check your typing!"};
	
	
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}