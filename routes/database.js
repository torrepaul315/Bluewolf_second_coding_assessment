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
//get the search history of an individual user
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
