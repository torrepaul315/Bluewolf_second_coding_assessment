var express = require('express');
var router = express.Router();
var https = require('https');

/* GET home page. */

// ` https://api.darksky.net/forecast/DARK_SKY/${lat},${long}`


//router.get("darksky") with variabl
router.get(`/:latlong`,(req, res, next) => {
    var lat = req.params.latlong;
  //  console.log('something happened!',lat);

    https.get(`https://api.darksky.net/forecast/7907530ae0b513bbc106eb5287aa40f4/`+ lat, function (response) {
    //  console.log('statusCode:', res.statusCode);
       //console.log('headers:', res.headers);
      var info ="";
       response.on('data', function(chunk){
    //     console.log('response data', typeof d);
        info += chunk;

       });

       response.on("end", function(){
         if (response.statusCode === 200){
           try{
            var data = JSON.parse(info);
      //      console.log(data);
            res.json(data);

           }catch(error){
             console.log("couldn't JSON parse!")
           }
         } else {
           console.log("sorry something failed!")
         }
       });
    })
  //   .end(weatherInfo => {
  //     console.log('got hurr!');
  //   res.json(weatherInfo);
  // }).catch(err => {
  //   console.log("got hurr to errorland!");
  //   next(err)
  // })
});

module.exports = router;
