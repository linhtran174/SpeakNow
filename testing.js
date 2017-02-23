function strMapToJSON(strMap) {
	let obj = Object.create(null);
    for (let [k,v] of strMap) {
        obj[k] = v;
    }
    return JSON.stringify(obj);
}

var usersMap = new Map();

usersMap.set('1', 'sdasdasdasd');
usersMap.set('2', 'sdasdasdasdasda');

usersMap.forEach((value, key)=>{
	console.log(key + " " + value);
})


console.log(usersMap.get('2'));


function objToStrMap(obj) {
	let strMap = new Map();
	for (let k of Object.keys(obj)) {
	    strMap.set(k, obj[k]);
	}
	return strMap;
}


console.log(objToStrMap(JSON.parse(strMapToJSON(usersMap))));