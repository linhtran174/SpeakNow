const libs = require('../lib/config.js')
var jwt = require('jsonwebtoken');

var db = libs.db;
var wss = libs.wss;

var matchMakeThreshold = 10
var interviewQueue = []

setInterval(matchMake, 10000)

function matchMake(){
	// clean interviewQueue:
	var newQueue = []
	var newI = 0;
	for(var i = 0; i < interviewQueue.length; i++){
		var p = interviewQueue[i]
		if(!p.s.isAlive) continue;
		newQueue[newI] = p;
		newI++;
	}
	interviewQueue = newQueue;

	// console.log(interviewQueue)

	while (interviewQueue.length > 1){
		var p1 = interviewQueue[0];

		var bestLevelDiff = 1000
		var bestP2;
		// choose best person
		var p2;
		for(var i = 1; i < interviewQueue.length; i++){
			p2 = interviewQueue[i];

			lDiff = Math.abs(p2.m.level - p1.m.level)
			if (lDiff == 0){	
				bestP2 = p2;
				break;
			}
			if (lDiff < bestLevelDiff){
				bestLevelDiff = lDiff
				bestP2 = p2;
			}
		}
		p2 = bestP2

		// send interviewOffer
		p1.s.send(JSON.stringify({
			api: "interviewOffer",
			peerId: p2.m.peerId,
			initiator: true
		}));

		p2.s.send(JSON.stringify({
			api: "interviewOffer",
			peerId: p1.m.peerId,
			initiator: false
		}));
		
		interviewQueue.shift()
		interviewQueue.splice(bestP2, 1);
	}
}

var api = {};

api['interviewNow'] = function(socket, message){
	interviewQueue.push({s: socket, m: message})
	if(interviewQueue.length == matchMakeThreshold)
		matchMake()
}

var wrongInterviewM = {status: "failed", message: "Wrong interview_id"}
var noPrivilegeM = {status: "failed", message: "You dont have the privilege to join this interview"}
var waitingRoom = {}

api['joinInterview'] = function(socket, message){
	var interview_id = message.interview_id;
	var peerId = message.peerId;
	jwt.verify(message.token, libs.ssl.key, (err, decoded)=>{
		if(err){
			socket.jsend({status: "failed", message: err})
		}
		else db.query("SELECT * from interviews where interview_id = ?", 
			[interview_id], (err, docs, fields)=>{
			if(docs.length < 1){
				socket.jsend(wrongInterviewM)
				return;
			}
			if(docs[0].p1_id != decoded.id && docs[0].p2_id != decoded.id){
				socket.jsend(noPrivilegeM)
				return;
			}
			var p = waitingRoom[interview_id]
			if(p){
				if(p.socket.isAlive)
				p.socket.jsend({
					api : "startInterview",
					peerId : peerId,
					initiator : true
				})
				socket.jsend({
					api : "startInterview",
					peerId : p.peerId,
					initiator : false	
				})
				delete waitingRoom[interview_id]
			}
			else{
				waitingRoom[interview_id] = {
					socket : socket,
					peerId : peerId
				}
			}
		})
	})
}

module.exports = function(socket, message){
	if(message.api in api){
		api[message.api](socket, message)
	}
	else{
		socket.jsend({status: "failed", message: "wrong API bro!"})
	}
}