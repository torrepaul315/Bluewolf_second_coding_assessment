var express = require('express');
var router = express.Router();
var https = require('https');
var moment = require('moment');
var dotenv = require('dotenv/config');


/* GET home page. */




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
          var currentWeather = {};

          currentWeather.currentTemp =
            Math.round(darkSky.currently.temperature);
          currentWeather.currWIcon =
            darkSky.currently.icon;
          currentWeather.currWSummary =
            darkSky.currently.summary;


          currentWeather.tommHigh =
            Math.round(darkSky.daily.data[0].temperatureMax);
          currentWeather.tommLow =
            Math.round(darkSky.daily.data[0].temperatureMin);
          currentWeather.tommIcon =
            darkSky.daily.data[0].icon;
          currentWeather.tommSummary =
            darkSky.daily.data[0].summary;
          currentWeather.tommPrecip =
            darkSky.daily.data[0].precipProbability.toString();

          console.log("tomm precip! pre logic", currentWeather.tommPrecip);
          if (currentWeather.tommPrecip.length > 1)  {
            console.log('going into logic!');
            if (currentWeather.tommPrecip.charAt(2) === '0'){
              currentWeather.tommPrecip = currentWeather.tommPrecip.slice(3);
            } else{
            currentWeather.tommPrecip = currentWeather.tommPrecip.slice(2);
            }
          }
          console.log('day tomm precip post logic', currentWeather.tommPrecip);

          currentWeather.day2High =
            Math.round(darkSky.daily.data[1].temperatureMax);
          currentWeather.day2Low =
            Math.round(darkSky.daily.data[1].temperatureMin);
          currentWeather.day2Icon =
            darkSky.daily.data[1].icon;
          currentWeather.day2Summary =
            darkSky.daily.data[1].summary;
          currentWeather.day2Precip =
            darkSky.daily.data[1].precipProbability.toString();
            console.log('2day precip',currentWeather.day2Precip.length,currentWeather.day2Precip)
            if (currentWeather.day2Precip.length > 1)  {
              if (currentWeather.day2Precip.charAt(2) === '0'){
                currentWeather.day2Precip = currentWeather.day2Precip.slice(3);
              } else{

              currentWeather.day2Precip = currentWeather.day2Precip.slice(2);
              }
            }
            console.log('2day precip',currentWeather.day2Precip);
          res.json(currentWeather);

        } catch (error) {
          console.log(" upper route couldn't JSON parse!")
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

//as per vincent- keep in mind that server side things might not come back in order- I'm currently setting it up to do so, but you might want to refactor a sort either server or client side!

router.get(`/hist/:latlong`, (req, res, next) => {
  var data
  var dayInSecs = 86400;
  var daysInWeek = 7;
  var weekInSecs = dayInSecs * daysInWeek;
  var weekAgoInUnix = moment().format('X') - weekInSecs;
  //console.log(weekAgoInUnix);
  var histWeatherDataArray = [];
  var highTempArray = [];
  var lowTempArray = [];
  var humidityArray= [];

  console.log('something happened!', latWUnix);
  for (var x = 0; x < daysInWeek; x++) {
    var unixTimestampForHistoricalDay = weekAgoInUnix + (dayInSecs * x);

    var latWUnix = req.params.latlong + "," + unixTimestampForHistoricalDay;
    var darkskyRequest = https.get(`https://api.darksky.net/forecast/${process.env.DARK_SKY}/` + latWUnix, function(response) {
        var info = "";
        response.on('data', function(chunk) {

          info += chunk;
        });
        response.on("end", function() {
            if (response.statusCode === 200) {
              try {
                var histWbyDay = JSON.parse(info);
                console.log('burritoooo1', histWbyDay);

                var dailyHigh = Math.round(histWbyDay.daily.data[0].apparentTemperatureMax);
                var dailyLow = Math.round(histWbyDay.daily.data[0].apparentTemperatureMin);
                var dailyHumidity = Math.round(histWbyDay.daily.data[0].humidity);

                console.log(
                  dailyHigh, dailyLow, dailyHumidity
                );
                highTempArray.push(dailyHigh);
                lowTempArray .push(dailyLow);
                humidityArray.push(dailyHumidity);

            //  histWeatherDataArray.push(dailyHigh);
              } catch (error) {
                console.log(error, " hist weather couldn't JSON parse!")
              }
            }
          })
          // else {
          //   console.log("sorry something failed!")
          // }
        });

    }

    isDone = function() {
      console.log("timeout done")

      if (highTempArray.length == daysInWeek) {
         histWeatherDataArray.push(highTempArray,lowTempArray,humidityArray);

        console.log("at the end ", histWeatherDataArray)
        res.json(histWeatherDataArray)
      } else {
        setTimeout(isDone, 50);
      }
    }
    setTimeout(isDone, 50);

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
