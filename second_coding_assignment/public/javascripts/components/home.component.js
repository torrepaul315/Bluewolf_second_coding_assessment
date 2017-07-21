(function (){
  'use strict'

  angular.module('app')
    .component('startPage', {
      controller: controller,
      templateUrl: '/javascripts/components/home.template.html'
    })
    controller.$inject = ['$http']
    function controller($http) {
         console.log('something! ')


      const vm = this;
      var geocoder
      var map
      let latitude
      let longitude
      var latlong
      var pastWkLoHiTemp = [];
      var example = [75, 19, 3, 5, 64, 3];
      var haveHistData = false;
      console.log( example);

      vm.posts = [];
      console.log(vm.posts);
// working on getting a map up on page load!
    vm.$onInit = function () {
        console.log("doing something!");
    //    initMap(){
    let pos
    var infoWindow
    geocoder = new google.maps.Geocoder();

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 11,
    //  center: uluru
    });
    // var marker = new google.maps.Marker({
    //   position: uluru,
    //   map: map
    // });
    infoWindow = new google.maps.InfoWindow;

      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log(pos);
          infoWindow.setPosition(pos);
          infoWindow.setContent('Get Weather for your current location');
          infoWindow.open(map);
          map.setCenter(pos);
        //  callToApi(pos)
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      };
    }

        // vm.getLatLong = function(locationString)
    vm.getLatLong = function() {
      console.log('hooked up!',
      vm.locationString);
      var geoCode = {
        address: vm.locationString
      }
      console.log(geoCode);
      //vm.posts.push(geoCode);
      console.log(vm.posts);
      console.log("local array", vm.posts);
      //google.maps.Geocoder.geocode(GeocoderRequest);
      codeAddress(geoCode);
    }

    function codeAddress(GeocoderRequest) {
    console.log('inside code address!',GeocoderRequest);
    geocoder.geocode( GeocoderRequest, function(results, status) {
      if (status == 'OK') {
        console.log(
        'latitude',
          results[0].geometry.viewport.f.b,
        'longitude',
        results[0].geometry.viewport.b.b,

      );
      latitude = results[0].geometry.viewport.f.b;
      longitude = results[0].geometry.viewport.b.b;
      latlong = latitude.toPrecision(8)+','+longitude.toPrecision(8);
      console.log('combo!',latlong);
        findCurrentWeather(latlong);
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });


      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
//hmm- key is in the file, but isn't this something, along with the gmail key, something that should be in the .dotenv? hmm!
  function findCurrentWeather(latlong) {
    console.log('time to actually hit the api!');

   $http.get('/weatherInfo/'+ latlong).then((response) => {
          var currentTimeInUnix = response.data.currently.time
          console.log('curentTimeInUnix', currentTimeInUnix
          );

           var timeScrub =  moment.unix(currentTimeInUnix);

        //  vm.posts = [exampObj];
          showCurrentWeather(response,timeScrub);
//!!!!!turned this off while rendering current weather stuff!
        getPastWeekWeather(currentTimeInUnix);
        //  vm.weatherInfoCurrent = response;
        })
        .catch((err) => {
         console.log(err);
        });
  }
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
     weatherForecast.currTime = timePrep;
    //  var day = moment().format(timePrep);
     console.log(timePrep, weatherForecast);



     vm.currentWeather = [weatherForecast];



  }



  function getPastWeekWeather(UnixStartPoint) {
     for (var x = 0; x < 7; x++) {
       UnixStartPoint -= 86400;
       var dsHistWeather = latlong + ','+ UnixStartPoint
       //console.log(latlong,UnixStartPoint);
       $http.get('/weatherInfo/hist/'+ dsHistWeather).then((response) => {
             var dailyMax = response.data.daily.data[0].temperatureMax;

            var dailyMin = response.data.daily.data[0].temperatureMin;

            //might not need an object of high/low temps, but perhaps with a line graph!
            //  var dailyLoHi = {};
            //  dailyLoHi.min = dailyMin;
            //  dailyLoHi.max = dailyMax;
            //

            //set up an array to render!
              pastWkLoHiTemp.push(dailyMax);
              console.log(pastWkLoHiTemp);
           //  vm.weatherInfoCurrent = response;
         })
           .catch((err) => {
            console.log(err);
           });
     }
     //as per the console logs, this appeared to fire the function PRIOR to the for loop clompleting for whatever reason!
     pastWkLoHiTemp.reverse()
     console.log(pastWkLoHiTemp.length, typeof pastWkLoHiTemp, x);
     buildNewChart(pastWkLoHiTemp);

  }

// where I start my chart.js adventure!
        function buildNewChart(dataToShow) {
        var ctx = document.getElementById("myChart");
        console.log(ctx,  dataToShow.length, dataToShow, dataToShow.data);
        var myChart = new Chart(ctx,  {
            type: 'bar',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: 'HardRock!',

                    //data: [75, 19, 3, 5, 64, 3],
                    data: dataToShow,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
      }
    }

}());
