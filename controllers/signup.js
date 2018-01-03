var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var md5 = (string)=>{
	return crypto.createHash('md5').update(string).digest("hex");
}

var libs = require('../lib/config.js')
module.exports = function(req, res){
	var db = libs.db;
	// console.log(req.data)
	var email = req.data.email;
	var password = md5(req.data.password);
	var level = req.data.level;

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
		console.log("Inserting into db")
		user_id = libs.uid.generate();
		db.query("INSERT INTO users VALUES (?,?,?,?)", [email, password, level, user_id], (err, nothing, fields) => {
			if(err){
				res.send({message : error, status: "failed"})
				return;	
			}

			jwt.sign({
				email: email,
				id: user_id,
				level: level,
				exp: Math.floor(Date.now()/1000) + 86400
			}, libs.ssl.key, (err, token)=>{
				console.log("token signing done")
				if(err)	{
					res.send({
						message: err,
						status : "failed"
					});
					return;
				}
				console.log("about to send")
				res.send({
					message: "sign up success",
					token: token, 
					email: email,
					id: user_id,
					status: "success"
				})
				console.log("sending done")
			})
			
		})
	})
}
