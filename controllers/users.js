var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var md5 = (string)=>{
	return crypto.createHash('md5').update(string).digest("hex");
}
var wrongCredentialM = {status: "failed", message: "Got problem with your credentials! Please double check your typing!"};

var libs = require('../lib/config.js')
var db = libs.db;

var api = {};
api['login'] = function(req, res){
	email = req.data.email;
	password = md5(req.data.password);

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
					level: docs[0].level,
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
						email: docs[0].email,
						level: docs[0].level
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

api['signup'] = function(req, res){
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
					email: email,
					id: user_id,
					level: level,
					status: "success"
				})
			})
			
		})
	})
}


api['updateInfo'] = (req, res)=>{
	if(!req.data.token){
		res.send(wrongCredentialM);
		return;
	}
	jwt.verify(req.data.token, libs.ssl.key, (err, decoded)=>{
		if(err){
			res.send(wrongCredentialM)
			return;
		} 
		db.query("SELECT * from users WHERE email = ?", [req.data.email], (err, docs, fields)=>{
			if(docs.length != 0 && decoded.id != docs[0].user_id){
				res.send({status: "failed", message: "This email is taken already!"})
				return;
			}
			else{
				if(md5(req.data.oldpassword) != docs[0].password){
					res.send(wrongCredentialM);
					return;
				}
				db.query("UPDATE users SET email = ?, password = ?, level = ? WHERE user_id = ?", 
				[req.data.email, md5(req.data.newpassword), req.data.level, decoded.id], (err, docs, fields)=>{
					if(err) throw err;
					res.send({status: "success", message: "Update info successful!"})
				})		
			}
		})
	})
}


api['getInfo'] = (req, res)=>{
	if(!req.data.token){
		res.send(wrongCredentialM);
		return;
	}
	jwt.verify(req.data.token, libs.ssl.key, (err, decoded)=>{
		if(err){
			res.send(wrongCredentialM)
			return;
		} 
		
		db.query("SELECT * from users WHERE user_id = ?", 
		[decoded.id], (err, docs, fields)=>{
			if(err) throw err;
			res.send({status: "success", data: docs[0]})
		})
	})	
}

module.exports = function(req, res){
	if(req.data.api in api){
		api[req.data.api](req, res)
	}
	else{
		res.send({status: "failed", message: "wrong API bro!"})
	}
	return;
}