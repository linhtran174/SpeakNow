var liveSockets = []

module.exports = function(socket){
	liveSockets.push(socket)
	socket.isAlive = true;
	socket.on('pong', (message)=>{
		socket.isAlive = true;
	});

	socket.onConnectionLost = function(){}

	setInterval(()=>{
		liveSockets.forEach((socket)=>{
			if(socket.isAlive == false){
				socket.onConnectionLost(socket)
			}
			socket.isAlive = false;
    		socket.ping('', false, true);
		})
	}, 2000);
	
}