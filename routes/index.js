var express = require('express');
var router = express.Router();
var https = require('https');
var moment = require('moment');
var dotenv = require('dotenv/config');


/* GET home page. */

// ` https://api.darksky.net/forecast/DARK_SKY/${lat},${long}`


//router.get("darksky") with variabl
router.get(`/:latlong`, (req, res, next) => {
  var lat = req.params.latlong;
  //  console.log('something happened!',lat);
  process.env.DARK_SKY
  https.get(`https://api.darksky.net/forecast/${process.env.DARK_SKY}/` + lat, function(response) {
    //  console.log('statusCode:', res.statusCode);
    //console.log('headers:', res.headers);
    var info = "";
    response.on('data', function(chunk) {
      //     console.log('response data', typeof d);
      info += chunk;

    });

    response.on("end", function() {
      if (response.statusCode === 200) {
        try {
          var darkSky = JSON.parse(info);
          //console.log(darkSky);
          //pull current weather info, plus high/low/summary/icon for day +1 & +2
          var currentWeather = {};

          currentWeather.currentTemp =
            darkSky.currently.temperature;
          currentWeather.currWIcon =
            darkSky.currently.icon;
          currentWeather.currWSummary =
            darkSky.currently.summary;


          currentWeather.tommHigh =
            darkSky.daily.data[0].temperatureMax;
          currentWeather.tommLow =
            darkSky.daily.data[0].temperatureMin;
          currentWeather.tommIcon =
            darkSky.daily.data[0].icon;
          currentWeather.tommSummary =
            darkSky.daily.data[0].summary;


          currentWeather.day2High =
            darkSky.daily.data[1].temperatureMax;
          currentWeather.day2Low =
            darkSky.daily.data[1].temperatureMin;
          currentWeather.day2Icon =
            darkSky.daily.data[1].icon;
          currentWeather.day2Summary =
            darkSky.daily.data[1].summary;



          //console.log(currentWeather);
          res.json(currentWeather);

        } catch (error) {
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

// moment().format('X')

//as per vincent- keep in mind that server side things might not come back in order- I'm currently setting it up to do so, but you might want to refactor a sort either server or client side!

router.get(`/hist/:latlong`, (req, res, next) => {
  //moment().format('X')
  var data
  console.log("now hitting the hist route!")

  var dayInSecs = 86400;
  var daysInWeek = 7;
  var weekInSecs = dayInSecs * daysInWeek;
  var weekAgoInUnix = moment().format('X') - weekInSecs
  var histWeatherDataArray = [];
  var darkskyRequests = [];

  console.log('something happened!', latWUnix);
  for (var x = 0; x < daysInWeek; x++) {
    var unixTimestampForHistoricalDay = weekAgoInUnix + (dayInSecs * x);

    var latWUnix = req.params.latlong + "," + unixTimestampForHistoricalDay;
    var darkskyRequest = https.get(`https://api.darksky.net/forecast/${process.env.DARK_SKY}/` + latWUnix, function(response) {
        var info = "";
        response.on('data', function(chunk) {
          console.log('response data', typeof d);
          info += chunk;
        });
        response.on("end", function() {
            if (response.statusCode === 200 && x < 6) {
              try {
                console.log('burritoooo!');
                data = JSON.parse(info);
                console.log( typeof data);
                histWeatherDataArray.push(data)
              } catch (error) {
                console.log("couldn't JSON parse!")
              }
            } else {
              try {
                console.log('burritoooo!');
                data = JSON.parse(info);
                console.log(typeof data);
                histWeatherDataArray.push(data)
              } catch (error) {
                console.log("couldn't JSON parse!")
              }
            }

          })
          // else {
          //   console.log("sorry something failed!")
          // }
        });
        darkskyRequests.push(darkskyRequest)
    }

    isDone = function() {
      console.log("timeout done")

      if (histWeatherDataArray.length == daysInWeek) {
        console.log("at the end ", histWeatherDataArray)
        res.json(histWeatherDataArray)
      } else {
        setTimeout(isDone, 50);
      }
    }
    setTimeout(isDone, 50);

  });


//.catch(err => next(err))





//   .end(weatherInfo => {
//     console.log('got hurr!');
//   res.json(weatherInfo);
// }).catch(err => {
//   console.log("got hurr to errorland!");
//   next(err)
// })


/* notes from vincent ie chart issue
1- if you are going to do a loop to get the data(you have to make 7 calls one way or the other!) do that loop from the server side, NOT started by the front end controller
2- it's probably the async function that is causing the graph not to render properly, at least initially

3- do the calls from the back end in a new route, and then have a wait, or "is complete ", then send a response to the front end to render the data points


4- poor man's solution....have a while loop etc- don't return a response until a particular condition is met

BETTER solution- use features of a router library (it might already be in http, https!) check out https://github.com/luciotato/waitfor !!!!!
//

*/

module.exports = router;
