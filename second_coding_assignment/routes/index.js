var express = require('express');
var router = express.Router();
var https = require('https');

/* GET home page. */

// ` https://api.darksky.net/forecast/DARK_SKY/${lat},${long}`


//router.get("darksky") with variabl
router.get(`/:latlong`,(req, res, next) => {
    var lat = req.params.latlong;
    console.log('something happened!',lat);

    https.get(`https://api.darksky.net/forecast/7907530ae0b513bbc106eb5287aa40f4/`+ lat, function (res) {
      console.log('statusCode:', res.statusCode);
       //console.log('headers:', res.headers);

       res.on('data', (d) => {
         console.log('response data', d[0], d);
       });
    }).on('error', (e) => {
  console.error(e);
});



});

module.exports = router;
