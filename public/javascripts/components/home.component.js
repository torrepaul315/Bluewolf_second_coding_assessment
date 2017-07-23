(function() {
  'use strict'

  angular.module('app')
    .component('startPage', {
      controller: controller,
      templateUrl: '/javascripts/components/home.template.html'
    })
  controller.$inject = ['$http']

  function controller($http, $scope) {
    console.log('something!')


    const vm = this;
    let geocoder
    let map
    let latitude
    let longitude
    let latlong
    let geoCode

    let userName = 3;
    //  $scope.showSearchLocation = $scope.showSearchLocation || {};
    //  $scope.showSearchLocation.start = "Denver";
    vm.locationName = "londres";
    //do I need this?   var haveHistData = false;


    //
    // do I need this either? vm.locationName = "Denver"


    //!!!!! handle condition if person does not share location!...

    //!!! have map marker default to bluewolf hq!
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
      //trying it out down here
      getUsers()
      getSearchHistoryByUser(3)
    }

    // vm.getLatLong = function(locationString)
    vm.getLatLong = function() {
      console.log('hooked up!',
        vm.locationString);
      geoCode = {
        address: vm.locationString
      }
      console.log(geoCode);

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

    function findCurrentWeather(latlong) {
      $http.get('/weatherInfo/' + latlong).then((response) => {
          console.log(response);
          showCurrentWeather(response);

        //  getPastWeekWeather();
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function showCurrentWeather(currentWeather) {
      console.log(currentWeather);

      var datesAdded = currentWeather.data;
      console.log
      datesAdded.tomorrowDay = moment().add(1, 'days').format('dddd');
      datesAdded.day2Day = moment().add(2, 'days').format('dddd');
      vm.currentWeather = [datesAdded];



    }



    function getPastWeekWeather() {
      console.log('hist weather fired');

      $http.get('/weatherInfo/hist/' + latlong).then((response) => {
          var histWeatherData = response.data;
          var dailyHighTemps = histWeatherData[0];
          var dailyLowTemps = histWeatherData[1];
          var dailyHumidity = histWeatherData[2];
//hmm, just refactor this bad boy?
          var dayLabels = [
            moment().subtract(7, 'days').format('LL'),
            moment().subtract(6, 'days').format('LL'),
            moment().subtract(5, 'days').format('LL'),
            moment().subtract(4, 'days').format('LL'),
            moment().subtract(3, 'days').format('LL'),
            moment().subtract(2, 'days').format('LL'),
            moment().subtract(1, 'days').format('LL')
          ]
          buildTempChart(dayLabels, dailyHighTemps, dailyLowTemps);
          buildHumidityChart(dayLabels, dailyHumidity);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function addToUserSearchHistory(userName, location) {
      var locationName = location.address;
      $http.post('/database/' + userName + '/' + locationName)
        .then(function(response) {
          console.log(response, response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    function buildTempChart(dayLabels, dailyHighTemps, dailyLowTemps) {
      var ctx = document.getElementById("tempChart");
      var tempChart = new Chart(ctx, {
        type: 'bar',
        title: "Daily High temperature from the last week",
        data: {
          labels: dayLabels,
          datasets: [{
              label: 'Daily High Temp',
              data: dailyHighTemps,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255,99,132,1)',
              borderWidth: 2
            },
            {
              label: "Daily Low Temp",

              data: dailyLowTemps,

              backgroundColor: 'rgba(54, 162, 235, 0.2)',

              borderColor: 'rgba(54, 162, 235, 1)',

              borderWidth: 2
            }
          ]
        },
        options: {
          legend: {
            display: true,
            labels: {
              fontColor: 'black',
              fontSize: 20
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                max: 130,
                beginAtZero: true
              }
            }]
          }
        }
      });
    }

    function buildHumidityChart(dayLabels, dailyHumidity) {
      var ctx = document.getElementById("humidityChart");

      var tempChart = new Chart(ctx, {
        type: 'line',
        title: "Daily High temperature from the last week",
        data: {
          labels: dayLabels,
          datasets: [{
            label: 'Daily Humidity',
            data: dailyHumidity,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2
          }]
        },
        options: {
          legend: {
            display: true,
            labels: {
              fontColor: 'black',
              fontSize: 20
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                max: 1,
                min: 0,
                beginAtZero: true
              }
            }]
          }
        }
      });
    }

    function getUsers() {
      $http.get('/database/users').then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function getSearchHistoryByUser(user_id) {
      $http.get('/database/search_history/' + user_id).then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }

  }
}());
