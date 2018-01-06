const libs = require('../lib/config.js')
var jwt = require('jsonwebtoken');
var tests = require('../testData/tests.js');

var idToTest = {}

module.exports = function(req, res){
	var db = libs.db;
	if(!req.data.token){
		var randomTest = tests[randInt(0, tests.length - 1)]
		res.send(randomTest)	
	}
	else{
		jwt.verify(req.data.token, libs.ssl.key, (err, decoded)=>{
			var i = decoded.id
			if(!idToTest[i]) idToTest[i] = new Set()
			var num = randInt(0, tests.length - 1, idToTest[i])
			if(!num){
				res.send(tests[randInt(0, tests.length - 1)]);
			}
			else{
				idToTest[i].add(num)
				res.send(tests[num])
			}
		})
	}
	var wrongCredentialM = {status: "failed", message: "Got problem with your credentials! Please double check your typing!"};
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