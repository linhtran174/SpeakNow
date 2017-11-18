var bodyParser = require('body-parser').json();
var md5 = require('crypto').createHash('md5');

module.exports = function(req, res, libs){
	var db = libs.db;
	console.log(req.headers)
	email = req.headers.email;
	password = md5.update(req.headers.password).digest("hex");

	db.query("SELECT COUNT(email) FROM users where email = ?", [email],
	(err, docs, fields) => {
		if(docs.length != 0){
			res.end(JSON.stringify({message : "Email has already been registed"}));
		}

		db.query("INSERT INTO users VALUES (?,?)", [email, password], (err, res, libs) => {
			if(err) res.end(JSON.stringify({message : error}))

			res.end(JSON.stringify(
				message: "sign up success"
			))
		})
	})
}