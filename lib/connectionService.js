module.exports = function(){
	var obj = {};

	obj.liveSockets = [];

	obj.addSocket = function(socket){
		liveSockets.push(socket);
	}

	obj.onConnectionLost = function(socketHandler){
		
	}

	setInterval(()=>{
		for(socket : liveSockets){
			
		}	
	}, 5000);
	
	return obj;
}