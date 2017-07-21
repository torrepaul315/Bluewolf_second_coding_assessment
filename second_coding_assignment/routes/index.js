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

//route to get historical data

router.get(`/hist/:latlong`,(req, res, next) => {
    console.log("now hitting the hist route!")
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


/* notes from vincent ie chart issue
1- if you are going to do a loop to get the data(you have to make 7 calls one way or the other!) do that loop from the server side, NOT started by the front end controller
2- it's probably the async function that is causing the graph not to render properly, at least initially

3- do the calls from the back end in a new route, and then have a wait, or "is complete ", then send a response to the front end to render the data points


4- poor man's solution....have a while loop etc- don't return a response until a particular condition is met

BETTER solution- use features of a router library (it might already be in http, https!) check out https://github.com/luciotato/waitfor !!!!!
//

*/

module.exports = router;
