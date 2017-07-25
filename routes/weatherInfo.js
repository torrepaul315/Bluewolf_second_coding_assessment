var express = require('express');
var router = express.Router();
var https = require('https');
var moment = require('moment');
var dotenv = require('dotenv/config');
//come back to this!
var console  = require('console');

//think! refactor vars to consts and lets

/* GET home page. */

const DARK_SKY_API_POLLING_TIME = `${process.env.DARK_SKY_API_POLLING_TIME}`;
const DARK_SKY_ENDPOINT = `${process.env.DARK_SKY_ENDPOINT}/${process.env.DARK_SKY_APIKEY}/`;


//router.get("darksky") with variabl
router.get(`/:latlong`, (req, res, next) => {
  var lat = req.params.latlong;

  https.get(DARK_SKY_ENDPOINT + lat, function(response) {

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
          console.log(darkSky);

          currentWeather.currentTemp =
            Math.round(darkSky.currently.temperature);
          currentWeather.currWIcon =
            darkSky.currently.icon;
          currentWeather.currWSummary =
            darkSky.currently.summary;

//think of refactoring this into a for loop!
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
            } else {
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

});

//route to get historical data

//as per vincent- keep in mind that server side things might not come back in order- I'm currently setting it up to do so, but you might want to refactor a sort either server or client side!

router.get(`/hist/:latlong`, (req, res, next) => {
  var data
  var dayInSecs = 86400;
  var daysInWeek = 7;
  var weekInSecs = dayInSecs * daysInWeek;
  var weekAgoInUnix = moment().format('X') - weekInSecs;
  var histWeatherDataArray = [];
  var highTempArray = [];
  var lowTempArray = [];
  var humidityArray= [];

  console.log('something happened!', latWUnix);
  for (var x = 0; x < daysInWeek; x++) {
    var unixTimestampForHistoricalDay = weekAgoInUnix + (dayInSecs * x);

    var latWUnix = req.params.latlong + "," + unixTimestampForHistoricalDay;
    var darkskyRequest = https.get(DARK_SKY_ENDPOINT + latWUnix, function(response) {
        var info = "";
        response.on("data", function(chunk) {

          info += chunk;
        });
        response.on("end", function() {
            if (response.statusCode === 200) {
              try {
                var histWbyDay = JSON.parse(info);
          //      console.log('burritoooo1', histWbyDay);
              } catch (error) {
                console.log(error, " hist weather couldn't JSON parse!");
                return;
              }

              var thing = histWbyDay.daily.data[0];
              var dailyHigh = Math.round(thing.apparentTemperatureMax);
              var dailyLow = Math.round(thing.apparentTemperatureMin);
              var dailyHumidity = thing.humidity;

              // console.log(
              // thing,
              // 'humidity long form' , histWbyDay.daily.data[0].humidity,
              //   dailyHigh, dailyLow, dailyHumidity
              // );
              highTempArray.push(dailyHigh);
              lowTempArray .push(dailyLow);
              humidityArray.push(dailyHumidity);
              //  histWeatherDataArray.push(dailyHigh);
            } else {
              console.log("Unsuccessful API call to Darksky, status code: ", response.statusCode);
            }
          })
          // else {
          //   console.log("sorry something failed!")
          // }
        });

    }

    isDone = function() {
      console.log("timeout done")

      if (highTempArray.length === daysInWeek) {
         histWeatherDataArray.push(highTempArray, lowTempArray, humidityArray);

        console.log("at the end ", histWeatherDataArray)
        res.json(histWeatherDataArray)
      } else {
        setTimeout(isDone, DARK_SKY_API_POLLING_TIME);
      }
    }
    setTimeout(isDone, DARK_SKY_API_POLLING_TIME);

  });



module.exports = router;
