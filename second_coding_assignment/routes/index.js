var express = require('express');
var router = express.Router();

/* GET home page. */

// ` https://api.darksky.net/forecast/7907530ae0b513bbc106eb5287aa40f4/${lat},${long}`


//router.get("darksky") with variabl
router.get(`/:lat:long`,
  function(req, res, next) {
   http.get
    res.render('index', { title: 'Express' });
});

module.exports = router;
