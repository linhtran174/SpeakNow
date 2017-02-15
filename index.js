var express = require('express'),
	fs = require('fs')
var app = express()


app.get('/', function (req, res) {
  res.set('Content-Type', 'text/html');
  res.send(fs.readFileSync('index.html'));
})

var nameMap = {};
app.get('/register/:name', (req, res)=>{
	var name = req.params.name;
	if(nameMap[name]){
		res.status(404).send("Co nguoi dung ten nay roi");
	}
	else{
    	nameMap[name] = 1;
    	res.status(200).send("Register thanh cong");
	}
})


app.listen(80, function () {
  console.log('Example app listening on port 80!')
})