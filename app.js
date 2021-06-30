var express = require('express');

var es6Renderer = require('express-es6-template-engine');
var session = require('express-session');
var pgp = require('pg-promise')({ });
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
    console.log(x)
    res.render(__dirname + '/views/app.html');
    
  } catch (error) {
    console.log(error)
  }
  });
app.post('/search', (req, res, next) => {
  const { search } = req.body
  console.log('req.body', search);
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
// app.get('/results')
// app.get('/restaurant/:id', function(req, resp, next) {
//   let id = req.params.id;
//   db.any(`
//     select
//       restaurant.name as restaurant_name,
//       restaurant.address,
//       restaurant.category,
//       reviewer.name as reviewer_name,
//       review.title,
//       review.stars,
//       review.review
//     from
//       restaurant
//     left outer join
//       review on review.restaurant_id = restaurant.id
//     left outer join
//       reviewer on review.reviewer_id = reviewer.id
//     where restaurant.id = ${id}
//   `)
//     .then(function(reviews) {
//       console.log('reviews', reviews);
//       resp.render('restaurant.hbs', {
//         restaurant: reviews[0],
//         reviews: reviews,
//         hasReviews: reviews[0].reviewer_name
//       });
//     })
//     .catch(next);
// });
// app.get('/restaurant/:id', function(req, resp, next) {
//   let id = req.params.id;
//   db.any(`
//     select
//       reviewer.name as reviewer_name,
//       review.title,
//       review.stars,
//       review.review
//     from
//       restaurant
//     inner join
//       review on review.restaurant_id = restaurant.id
//     inner join
//       reviewer on review.reviewer_id = reviewer.id
//     where restaurant.id = ${id}
//   `)
//     .then(function(reviews) {
//       return [
//         reviews,
//         db.one(`
//           select name as restaurant_name, * from restaurant
//           where id = ${id}`)
//       ];
//     })
//     .spread(function(reviews, restaurant) {
//       resp.render('restaurant.hbs', {
//         restaurant: restaurant,
//         reviews: reviews
//       });
//     })
//     .catch(next);
// });





var PORT = process.env.PORT || 8000;
  app.listen(PORT, function () {
    console.log('Listening on port ' + PORT);
  });