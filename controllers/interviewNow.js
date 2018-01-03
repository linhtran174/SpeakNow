const libs = require('../lib/config.js')

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
			interviewOffer: {
				peerId: p2.m.peerId,
				initiator: true
			}
		}));

		p2.s.send(JSON.stringify({
			interviewOffer: {
				peerId: p1.m.peerId,
				initiator: false
			}
		}));
		
		interviewQueue.shift()
		interviewQueue.splice(bestP2, 1);
	}
}

module.exports = function(socket, message){
	var db = libs.db;
	var wss = libs.wss;
	var m = message.interviewNow;

	interviewQueue.push({s: socket, m: m})
	if(interviewQueue.length == matchMakeThreshold)
		matchMake()
}