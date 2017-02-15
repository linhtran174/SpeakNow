var express = require('express'),
	fs = require('fs')
var app = express()


app.get('/', function (req, res) {
  res.set('Content-Type', 'text/html');
  res.send(fs.readFileSync('index.html'));
})

var nameMap = {};
app.get('/register/:name', (req, res)=>{
	if(nameList[name]){
		res.status(404).send("Co nguoi dung ten nay roi");
	}
	else{
    	nameList[name] = req.params.name;	
    	res.status(200).send("Register thanh cong");
	}
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})