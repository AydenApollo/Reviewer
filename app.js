var express = require('express');
var bodyParser = require('body-parser');
var es6Renderer = require('express-es6-template-engine');
var session = require('express-session');
var app = express();

app.engine('html', es6Renderer);
app.set('views', 'public')
app.set('views', 'views');
app.set('view engine', 'html');

app.use(bodyParser.urlencoded());
app.use('public/', express.static('public'));

app.get('/', (req, res) => {
    res.render(__dirname + '/views/app.html');
  });






app.listen(8000, () => {
    console.log('listening on *:8000');
  });