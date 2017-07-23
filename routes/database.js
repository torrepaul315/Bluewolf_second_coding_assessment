var express = require('express');
var router = express.Router();
const knex = require('../db')
//get list of all users in database
router.get('/users', function(req, res, next) {
  console.log('hit get users ');
  knex('weather_user')
    .then(comments => res.json(comments))
    .catch(err => next(err))
})

// think about it...consider refactoring googlemaps through the back end- think of everything going through one endpoint
//also -, think USER instead of database!

//3 holy grails DRY, encapsulation in object oriented programming, separation of concerns- code does one thing and one thing only!

//checkout bob martin- code craftsmanship!

//get the search history of an individual- the search term is a core part of the functionality! you would want to collect that on the backend and then reach out from YOUR server
router.get('/search_history/:user_id', function(req, res, next) {
  console.log('hit search by user', req.params.user_id);
  knex('search_history')
    .where({
      user_id: req.params.user_id
    })
    .orderBy('created_at', 'desc')
    .then(comments => res.json(comments))
    .catch(err => next(err))
})

//log each search location submission by user
router.post('/:userName/:location', function(req, res, next) {
  console.log('hit route!', req.params.location, req.params.userName);
  knex('search_history')
    .insert({
      location: req.params.location,
      user_id: req.params.userName
    })
    .returning('*')
    .then(comments => res.json(comments[0]))
    .catch(err => next(err))
});

module.exports = router;
