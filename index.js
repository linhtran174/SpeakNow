var express = require('express'),
	fs = require('fs')
	bodyParser = require('body-parser');
	
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post('/postId', (req,res)=>{
	console.log(req.params);
	console.log(req.body);
})


app.listen(80, function () {
  console.log('Example app listening on port 80!')
})