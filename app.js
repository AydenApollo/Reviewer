var express = require('express');

var es6Renderer = require('express-es6-template-engine');
var session = require('express-session');
var pgp = require('pg-promise')({ })
var dbsettings = process.env.DATABASE_URL || {database: 'ltnoebcr', password: 'hTL4uv-grigmul21j799h8_BU_8SfHOw', host: 'batyr.db.elephantsql.com', user: 'ltnoebcr'};
var db = pgp(dbsettings);
var app = express();

app.engine('html', es6Renderer);
//app.set('views', 'public')
app.set('views', 'views');
app.set('view engine', 'html');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public/', express.static('public'));

app.get('/', async (req, res) => {
  try {
    const x = await db.query('SELECT * FROM restaurant');
    //console.log(x)
    res.render(__dirname + '/views/app.html');
    
  } catch (error) {
    console.log(error)
  }
  });
app.post('/search', (req, res, next) => {
  const { search } = req.body
  // console.log('req.body', search);
  const term = search;
  db.any(`
  SELECT * FROM restaurant WHERE restaurant.name ILIKE '%${term}%'`)
   .then(function(resultsArray) {
     console.log('results', resultsArray);
     res.render('search_results', {
       locals: { 
         results: resultsArray
        }, 
        partials: {
          partial: 'footer'
        }
      
     })
   })
   .catch(next)
});

app.get('/restaurant/:id', function(req, res, next) {
const { id } = req.params
const reviewID = id;
 db.query(`
SELECT * FROM review WHERE review.restaurant_id = ${reviewID}`)
.then(function(reviews) {
      //console.log('reviews', reviews);
      //resp.send(reviews)
       res.render('reviewPage', {
         locals: {
                reviews: reviews
              }
            });
 }).catch(error => {
   console.log('error')
   next(error)
 });
})


app.get('/restaurant/reviewer/:id', function(req, res, next) {
const { id } = req.params
const reviewerID = id
console.log(reviewerID)
db.one(`SELECT * FROM reviewer WHERE reviewer.id = ${reviewerID}`)
     .then(function(reviewer) {
      console.log('reviewer', reviewer);
      res.render('reviewerInfo', {
        locals: {
               reviewer: reviewer
             }
     });
    })
    .catch(next)
});





var PORT = process.env.PORT || 8000;
  app.listen(PORT, function () {
    console.log('Listening on port ' + PORT);
  });