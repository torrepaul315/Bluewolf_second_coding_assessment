(function() {
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
      let geocoder
      let map
      let latitude
      let longitude
      let latlong
      let geoCode
      //this should prolly be renamed!
      let userName = 3;

      //do I need this?   var haveHistData = false;


      //
      // do I need this either? vm.locationName = "Denver"


      // working on getting a map up on page load!
      vm.$onInit = function() {
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
        geoCode = {
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
        console.log('inside code address!', GeocoderRequest);
        geocoder.geocode(GeocoderRequest, function(results, status) {
          if (status == 'OK') {
            console.log(
              'latitude',
              results[0].geometry.viewport.f.b,
              'longitude',
              results[0].geometry.viewport.b.b,

            );
            latitude = results[0].geometry.viewport.f.b;
            longitude = results[0].geometry.viewport.b.b;
            latlong = latitude.toPrecision(8) + ',' + longitude.toPrecision(8);
            console.log('combo!', latlong);
            findCurrentWeather(latlong);
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
            });
            addToUserSearchHistory(userName, geoCode);

          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
      //hmm- key is in the file, but isn't this something, along with the gmail key, something that should be in the .dotenv? hmm!
      function findCurrentWeather(latlong) {
        console.log('time to actually hit the api!');

        $http.get('/weatherInfo/' + latlong).then((response) => {
            console.log(response);
            // var currentTimeInUnix = response.data.currently.time
            // console.log('curentTimeInUnix', currentTimeInUnix
            // );
            //
            //  var timeScrub =  moment.unix(currentTimeInUnix);

            //  vm.posts = [exampObj];
            showCurrentWeather(response);
            //!!!!!turned this off while rendering current weather stuff!
            getPastWeekWeather();
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
      function showCurrentWeather(currentWeather) {
        console.log(currentWeather);

        var datesAdded = currentWeather.data;
        console.log
        datesAdded.tomorrowDay = moment().add(1, 'days').format('dddd');
        //console.log(datesAdded.tomorrowDay);
        datesAdded.day2Day = moment().add(2, 'days').format('dddd');
        // if (datesAdded.currWIcon === "partly-cloudy-day") {
        //   datesAdded.currWIcon = "background: url('images/partiallyCloudy.png')"
        // }


        console.log(datesAdded);
        vm.currentWeather = [datesAdded];



      }



      function getPastWeekWeather() {
        console.log('hist weather fired');
        // UnixStartPoint -= 86400;
        // var dsHistWeather = latlong

        $http.get('/weatherInfo/hist/' + latlong).then((response) => {
            console.log(response);

            var dailyHighTemps = response.data;
            var dayLabels = [
              moment().subtract(7, 'days').format('LL'),
              moment().subtract(6, 'days').format('LL'),
              moment().subtract(5, 'days').format('LL'),
              moment().subtract(4, 'days').format('LL'),
              moment().subtract(3, 'days').format('LL'),
              moment().subtract(2, 'days').format('LL'),
              moment().subtract(1, 'days').format('LL')
            ]
            console.log(dayLabels);
            //set up an array to render!
            //  pastWkLoHiTemp.push(dailyMax);
            //  console.log(pastWkLoHiTemp);
            buildNewChart(dayLabels, dailyHighTemps);
            //  vm.weatherInfoCurrent = response;
          })
          .catch((err) => {
            console.log(err);
          });
      }

      function addToUserSearchHistory(userName, location) {
        console.log(userName, location.address);
        var locationName = location.address;
        $http.post('/database/' + userName + '/' + locationName)
          .then(function(response) {
            console.log(response, response.data);
            //vm.postEdit = post.data;
          })
          .catch((err) => {
            console.log(err);
          });
      };









      function buildNewChart(dayLabels, dailyHighTemps) {
        var ctx = document.getElementById("myChart");

        var myChart = new Chart(ctx, {
          type: 'bar',
          title: "Daily High temperature from the last week",
          data: {
            labels: dayLabels,
            // ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: 'Daily High Temp',

                data: dailyHighTemps,
                //data: dataToShow,
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
              },
              {
                label: "Daily Low Temp",

                data: [4, 3, 5, 3, 2, 8, 37],

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
              }
            ]
          },
          options: {
            legend: {
              display: true,
              labels: {
                fontColor: 'darkblue',
                fontSize: 24
              }
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
      }

  }


}());
