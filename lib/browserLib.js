function send(method, server, params, callback){
	var xhr = new XMLHttpRequest()
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.open(method, server, true);
	xhr.onreadystatechange = () => {
		if(this.readyState == 1 && this.status == 200){
			callback(JSON.parse(xhr.responseText));
		}
	}
	xhr.send(JSON.stringify(params));
}

function $(elementId){
	return document.getElementById(elementId);
}