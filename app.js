var express = require('express');
var bodyParser = require('body-parser');
var es6Renderer = require('express-es6-template-engine');
var session = require('express-session');
var pgp = require('pg-promise')({ });
var dbsettings = process.env.DATABASE_URL || {database: 'Reviewer'};
var db = pgp(dbsettings);
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






  var PORT = process.env.PORT || 8000;
  app.listen(PORT, function () {
    console.log('Listening on port ' + PORT);
  });