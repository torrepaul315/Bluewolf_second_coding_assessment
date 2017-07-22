var express = require('express');
var router = express.Router();
const knex = require('../db')

//! remember it appears as though there's a db url that you'll want to stick in your .env- keep that in mind lad!


/* GET users listing. */
router.post('/:userName/:location', function(req, res, next) {
  console.log('hit route!',req.params.location,req.params.userName);
  knex('search_history')
    .insert({location: req.params.location,user_id:req.params.userName})
    //  I dont think I need this!.where({user_id: req.params.userName})
    .returning('*')
    .then(comments => res.json(comments[0]))
    .catch(err => next(err))
});

module.exports = router;
