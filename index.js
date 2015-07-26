var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
var checkAuth;
var authToken;
if (JSON.stringify(req["query"]) === '{}')
	checkAuth=false;
else{
	checkAuth=true;
	console.log (JSON.parse(req["query"].auth).token);
	authToken = JSON.stringify(JSON.parse(req["query"].auth).token);
}
  res.render('home', {
    title: 'Welcome',
	authenticated:checkAuth,
	authToken:authToken
  });
});
app.get('/register', function(req, res) {
  res.render('register', {
    title: 'Register!'
  });
});
app.use('/register',require('./views/register')());
app.use('/geniuses',function(req, res){
	res.render('listAllGeniuses', {});
});
app.use('/genius',function(req, res){
	res.render('geniusInfo', {});
});
app.get('/login', function(req, res) {
  res.render('login', {
    title: 'Login!'
  });
});
app.use('/login',require('./views/login')());
app.listen(3001);