var crypto = require('crypto');

var md5 = (string)=>{
	return crypto.createHash('md5').update(string).digest("hex");
}

module.exports = function(req, res, libs){
	var db = libs.db;
	console.log(req.headers)
	email = req.headers.email;
	password = md5(req.headers.password);

	db.query("SELECT * FROM users where email = ?", [email],
	(err, docs, fields) => {
		if(docs.length != 0){
			res.end(JSON.stringify({
				message : "Email has already been registed",
				status: "failed",
			}));
			return;
		}

		db.query("INSERT INTO users VALUES (?,?)", [email, password], (err, docs, fields) => {
			if(err){
				res.end(JSON.stringify({message : error, status: "failed"}))
				return;	
			}

			res.end(JSON.stringify({
				message: "sign up success",
				status : "success"
			}));
		})
	})
}
