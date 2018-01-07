var jwt = require('jsonwebtoken');
// var auth = require('auth.js');
var libs = require('../lib/config.js');
var db = libs.db;

var api = {}
api['getInterviews'] = (req, res)=>{
	var db = libs.db;
	if(!req.user) return;
	
	var u = req.user;
	db.query("SELECT * FROM interviews WHERE p1_id = ? or p2_id = ?",
	[u.id, u.id],
	(err, docs, fields)=>{
		res.send({
			status: "success",
			interviews: docs,
		})
	})
}

api['recordInterview'] = (req, res)=>{
	if(!req.user) return;
	var u = req.user;

	db.query("SELECT * from interviews where interview_id =?" , [req.data.interview_id], 
		(err, results, fields)=>{
		p = (u.id == results[0].p1_id)?"p1_":"p2_";
		var query = "UPDATE interviews SET status = ?, "+p+"question = ?,"+p+"rating = ? where interview_id = ?";
		db.query(query, ["done", req.data.test, req.data.rating, req.data.interview_id],
		(err, docs, fields)=>{
			if(err) res.send({status: "failed", message: err})
			res.send({
				status: "success",
				message: "your interview info was successfully recorded!"
			})
		})
	});
}

function interviewNotiTemplate(name, interviewTime, token){
	return 'Hi, ' + name + '.<br>Based on your request earlier we have schedule an interview at ' + interviewTime +
	'.<br>Click <a href="https://xseed.tech/interviews/'+token +'">here</a> to confirm your schedule'
}

function sendOffer(p1, p2, interviewTime){
	var interview_id = libs.uid.generate()

	console.log('sending offer: interviewTime:', interviewTime)
	//create interview
	db.query("INSERT INTO interviews (interview_id, time, status) values (?,?,?)", 
	[interview_id, interviewTime.getTime()/1000, "scheduling", p1.user.id, p2.user.id], (err, docs, fields)=>{
		if(err) throw err
	});

	jwt.sign({
		interview_id: interview_id,
		user: p1.user,
	}, libs.ssl.key, (err, token)=>{

		libs.sendmail({
			from: 'linh@xseed.tech',
			to: p1.user.email,
			subject: 'Hi, ' + p1.user.email.split('@')[0] + ' we have found a peer for you',
			html: interviewNotiTemplate(p1.user.email.split('@')[0], interviewTime.toString(), token)
		}, function(err, reply) {
			console.log(err && err.stack);
			// console.dir(reply);
		});	
	})

	jwt.sign({
		interview_id: interview_id,
		user: p2.user,
	}, libs.ssl.key, (err, token)=>{
		libs.sendmail({
			from: 'linh@xseed.tech',
			to: p2.user.email,
			subject: 'Hi, ' + p2.user.email.split('@')[0] + ' we have found a peer for you',
			html: interviewNotiTemplate(p2.user.email.split('@')[0], interviewTime.toString(), token)
		}, function(err, reply) {
			console.log(err && err.stack);
			// console.dir(reply);
		});	
	})
}


var matchMakePeopleThreshold = 2
var matchMakeTimeThreshold = 10000 //s
var interviewQueue = []
function matchMake(){
	// console.log("match making")
	var i1 = 0;
	// console.log('Interview queue:' + interviewQueue)
	while(i1 < interviewQueue.length){
		var p1 = interviewQueue[i1];

		// choose best person
		var minLDiff = 10;
		var bestP2 = null;
		var p2;
		for(var i2 = i1 + 1; i2 < interviewQueue.length; i2++){
			p2 = interviewQueue[i2];

			if(p1.user.id == p2.user.id) continue;

			// check first common time slot
			if(!firstCommonTimeslot(p1, p2))
				continue;

			lDiff = Math.abs(p2.user.level - p1.user.level)
			if (lDiff == 0){	
				bestP2 = i2;
				break;
			}
			if (lDiff < minLDiff){
				minLDiff = lDiff;
				bestP2 = i2;
			}
		}

		if(!bestP2){
			i1++;
			continue;
		}
		p2 = interviewQueue[bestP2];

		var epoch = firstCommonTimeslot(p1,p2)*1000
		console.log("epoch interview time: ", epoch);
		var interviewTime = new Date(epoch);
		// send interviewOffer
		sendOffer(p1, p2, interviewTime)
		
		interviewQueue.splice(i1, 1);
		interviewQueue.splice(bestP2 + 1, 1);
		
	}
}

// assumes that freetimes are sorted
function firstCommonTimeslot(p1, p2){
	var ft1 = p1.data.freetime;
	var ft2 = p2.data.freetime;

	console.log('freetime array', JSON.stringify(ft1, ft2)) 
	var i = 0, j = 0;
	while(i < ft1.length && j < ft2.length){
		s1 = ft1[i];
		s2 = ft2[j];
		var now = Date.now()
		if(s1 == s2 && s1 < now && s2 < now){
			ft2.firstCommonTimeslot = s1;
			ft1.firstCommonTimeslot = s1;
			console.log(s1)
			return s1;	
		} 
		if(s1 > s2)
			j++;
		else
			i++;
	}
	return null;
}

api['scheduleInterview'] = (req, res)=>{
	interviewQueue.push(req)
	if(interviewQueue.length == matchMakePeopleThreshold){
		matchMake()
	}
	
	res.send({
		status: "success", 
		state: "finding",
		message: "Request received. You will receive an email when we find a match for you!!"
	});
}

setInterval(matchMake, matchMakeTimeThreshold)


api['confirmInterview'] = (req, res)=>{
	var params = req.url.split('/')
	var token = params[2]
	jwt.verify(token, libs.ssl.key, (err, decoded)=>{
		if(err) res.send({status: "failed", message: err})

		var user = decoded.user;
		console.log("decoded interview_id:", decoded.interview_id)
		libs.db.query("SELECT * from interviews where interview_id = ?", [decoded.interview_id], 
		(err, docs, fields)=>{

			if(docs[0].status == "scheduling"){
				var p, status;
				if(docs[0].p1_id){
					p = 'p2_id';
					status = "scheduled";
				}
				else{
					p = 'p1_id';
					status = "scheduling";	
				}
				

				db.query("UPDATE interviews set status = ?, "+p+" = ? where interview_id = ?",
				[status, user.id, decoded.interview_id], 
				(err, result, fields)=>{
					if(err) throw err;
					res.send({status: "success", message: "We have received your confirmation :)"})
				});
			}
			else{
				res.send({status: "failed", message: "Wrong interview, buddy!"})
			}
		});

	})
}

function verifyAuthentication(req, res){
	var token = req.data.token;
	
	var user  = jwt.verify(token, libs.ssl.key, (err, decoded)=>{
		if(err){
			// res.send({message: err, status: "failed"})
			return;
		}
		req.user = decoded;
	})
}

module.exports = function(req, res){
	var params = req.url.split('/')
	if(params.length > 2){
		api['confirmInterview'](req, res);
	}
	else{
		verifyAuthentication(req, res)
		console.log(api)
		console.log(api)
		if(req.data.api in api){
			api[req.data.api](req, res)
		}
		else{
			res.send({status: "failed", message: "wrong API bro!"})
		}
	}
	return;
}