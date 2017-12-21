var jwt = require('jsonwebtoken');
var wrongCredentialM = {status: "failed", message: "Got problem with your token! Please try logging in again!"};


api = {}
api['getPastInterviews'] = (req, res, libs)=>{
	var db = libs.db;
	var token = req.headers.token;
	
	jwt.verify(token, libs.ssl.key, (err, decoded)=>{
		if(err) res.end(JSON.stringify(wrongCredentialM));

		console.log(decoded)
		db.query("SELECT * FROM users where email = ?", [decoded.user],
		(err, docs, fields) => {

		})
	})
}

api['insertInterview'] = (req, res, libs)=>{
	
}


module.exports = function(req, res, libs){
	if(req.headers.api in api){
		api[req.headers.api](req, res, libs)
	}
}