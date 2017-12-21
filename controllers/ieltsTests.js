var tests = null;


module.exports = function(req, res, libs){
	var db = libs.db;
	// var wrongCredentialM = {status: "failed", message: "Got problem with your credentials! Please double check your typing!"};
	if(tests == null){
		db.query("SELECT * from ielttest", (err, docs, fields)=>{
			tests = docs;
		})	
	}
	
	randomTest = tests[randInt(0, tests.length)]

	res.end(JSON.stringify(randomTest))
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}