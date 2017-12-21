var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var md5 = (string)=>{
	return crypto.createHash('md5').update(string).digest("hex");
}

module.exports = function(req, res, libs){
	var db = libs.db;
	// console.log(req.headers)
	var email = req.headers.email;
	var password = md5(req.headers.password);
	var level = req.headers.level;

	if (!(level >= 0 && level <= 5) ){
		res.send({
			message : "Wrong level value",
			status: "failed",
		})
		return;
	}

	db.query("SELECT * FROM users where email = ?", [email],
	(err, docs, fields) => {
		if(docs.length != 0){
			res.send({
				message : "Email has already been registed",
				status: "failed",
			});
			return;
		}
		user_id = libs.uid.generate();
		db.query("INSERT INTO users VALUES (?,?,?,?)", [email, password, level, user_id], (err, docs, fields) => {
			if(err){
				res.send({message : error, status: "failed"})
				return;	
			}

			jwt.sign({
				email: email,
				id: user_id,
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
					message: "sign up success",
					token: token, 
					email: docs[0].email,
					id: docs[0].user_id,
					status: "success"
				});
			})
			
		})
	})
}
