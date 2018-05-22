api = [];

var fs = require('fs');
api.recordStat = function(req, res){
	
}

module.exports = function(req, res){
	if(req.data.api in api){
		api[req.data.api](req, res);
	}
	else{
		res.end(fs.readFileSync('pages/benchmark.html'))
	}
}