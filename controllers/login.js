var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var md5 = (string)=>{
	return crypto.createHash('md5').update(string).digest("hex");
}
var wrongCredentialM = {status: "failed", message: "Got problem with your email/password! Please double check your typing!"};

module.exports = function(req, res, libs){
	var db = libs.db;
	email = req.headers.email;
	password = md5(req.headers.password);

	db.query("SELECT * FROM users where email = ?", [email],
	(err, docs, fields)=>{
		if(err) {
			res.end({status: "failed", message: err}) 
			return;
		}

		if(docs.length > 0){
			if(password == docs[0].password){
				jwt.sign({
					email: email,
					id: docs[0].user_id,
					exp: Math.floor(Date.now()/1000) + 86400
				}, libs.ssl.key, (err, token)=>{
					if(err)	{
						res.send({
							message: err,
							status : "failed"
						});
						return;
					}
					res.send({
						message: "sign in success",
						status: "success",
						token: token,
						id: docs[0].user_id,
						email: docs[0].email
					});
				})
			}
			else{
				res.send(wrongCredentialM) 
				return;
			}
		}
		else{
			res.send(wrongCredentialM) 
			return;
		}
	});
}