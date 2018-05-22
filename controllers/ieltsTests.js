const libs = require('../lib/config.js')
var jwt = require('jsonwebtoken');
var tests = require('../testData/tests.js');
for(i in tests){
	tests[i] = JSON.stringify(tests[i])
}

var idToTest = {}
var db = libs.db;

module.exports = function(req, res){	
	if(!req.data.token){
		if(!req.data.testNumber){
			var randomTest = tests[randInt(0, tests.length - 1)]
			res.end(randomTest)
		}
		else{
			res.end(tests[req.data.testNumber])
		}
	}
	else{
		jwt.verify(req.data.token, libs.ssl.key, (err, decoded)=>{
			var i = decoded.id
			if(!idToTest[i]) idToTest[i] = new Set()
			var num = randInt(0, tests.length - 1, idToTest[i])
			if(!num){
				res.end(tests[randInt(0, tests.length - 1)]);
			}
			else{
				idToTest[i].add(num)
				res.end(tests[num])
			}
		})
	}
	// var wrongCredentialM = {status: "failed", message: "Got problem with your credentials! Please double check your typing!"};
}

function randInt(min, max, exclusions) {
	if(!exclusions) return Math.floor(Math.random() * (max - min + 1) ) + min;
	var l = [];
	for(var i = min; i <= max; i++){
		if(exclusions.has(i)) continue;
		l.push(i)
	}
	return l[Math.floor(Math.random() * l.length)];
}