# Bluewolf_second_coding_assessment

review data binding! get city name to show! does it need to be in an ng-repeat? is there another format?


deployed on Heroku at https://bluewolf-skycast.herokuapp.com/
notes
1- not happy with current date format...that said you can just extract the string....come back to polish that with moment if other pieces come together!



var timeScrub =  moment.unix(currentTimeInUnix);

//  brainstorm! for currentweather I want to pull out
/* 1- current temp
   2- weather info to show an icon of some sort
   3- prolly connected to 2, a quick description!
   4- also, log the day!
    for future weather-
    1- (projected) hi temp
    2- weather info to show an icon of some sort
    3- prolly connected to 2, a quick description!

*/

function showCurrentWeather(currentWeather, timePrep) {
   var weatherForecast = {};
   weatherForecast.currentTemp = currentWeather.data.currently.apparentTemperature;
   weatherForecast.currWIcon = currentWeather.data.currently.icon;
   weatherForecast.currWSummary = currentWeather.data.currently.summary;

   var day = moment().format(timePrep);
   console.log(day, weatherForecast);



   vm.posts = [weatherForecast];



}

///things to think about !

1- right now, I'm passing the datestamps all the way back to the front end !
dont do that!
as per vincent a- make the call to dark sky
b- on the backend, pull out the data you want
c- send the data you need to render to the front end

(this will- clean up the whole unix conversion issue!
  on the back end, you make your first call, and you only need unix info for the second call! )
right now pre refactor, you're pulling out the timestamp on the front end, to then package and send the time stamp back... not necessary!
you will need a second route that loops, but handle the time stamp and time stamp adjustments within that route itself

then, again, just pass back the info that you want render for historical data on the front


right now you're sending the whole dam response... then parsing that on the from

then, use the res .finished stuff that vincent sent over

!!!!!!!!!!!!!!think about this!
Escaping characters

To escape characters in format strings, you can wrap the characters in square brackets.

moment().format('[today] dddd'); // 'today Sunday'
