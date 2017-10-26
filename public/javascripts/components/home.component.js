(function() {
  'use strict';

  angular.module('app')
    .component('startPage', {
      controller: controller,
      templateUrl: '/javascripts/components/home.template.html'
    })
  controller.$inject = ['$http'];

  function controller($http, $scope) {
    console.log('something!');
    //time to declare some variables!

    const vm = this;
    vm.userName = 3;
    vm.lastFiveSearches;
    vm.latlong;

    let geocoder;
    let map;
    let latitude;
    let longitude;
    let latlong;
    let geoCode;


    vm.changeUser = function(id) {
      console.log('wired up!', id, 'username', vm.userName);
      vm.userName = id;
      console.log(vm.userName);
      getSearchHistoryByUser(vm.userName);
    }
    //hmm. have map center on bluewolf hq?
    vm.$onInit = function() {
      console.log("doing something!");
      let pos
      var infoWindow

      geocoder = new google.maps.Geocoder();
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11
      });
      infoWindow = new google.maps.InfoWindow;
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
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        handleLocationError(false, infoWindow, map.getCenter());
      };
      getUsers()
      getSearchHistoryByUser(vm.userName)
    }

    vm.newSearch = function() {
      console.log(vm.newLocation)
    }

    vm.getLatLong = function(location) {
      console.log('hooked up!', location, vm.locationString);
      if (location) {
        geoCode = {
          address: location
        }
      } else {
        geoCode = {
          address: vm.locationString
        }
      }
      console.log(geoCode);

      console.log(vm.posts);
      console.log("local array", vm.posts);

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
            results[0].geometry.viewport.b.b
          );
          latitude = results[0].geometry.viewport.f.b;
          longitude = results[0].geometry.viewport.b.b;
          vm.latlong = latitude.toPrecision(8) + ',' + longitude.toPrecision(8);
          findCurrentWeather(vm.latlong);
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          });
          addToUserSearchHistory(vm.userName, geoCode);
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }

    vm.findCurrentWeather = findCurrentWeather();

    function findCurrentWeather() {
      $http.get('/weatherInfo/' + vm.latlong).then((response) => {
          showCurrentWeather(response);
          getPastWeekWeather();
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function showCurrentWeather(currentWeather) {
      console.log(currentWeather, 'the location name!', geoCode);

      var datesAdded = currentWeather.data;
      datesAdded.tomorrowDay = moment().add(1, 'days').format('dddd');
      datesAdded.day2Day = moment().add(2, 'days').format('dddd');
      datesAdded.location = geoCode.address;

      console.log(datesAdded);

      vm.currentWeather = [datesAdded];
    }

    function getPastWeekWeather() {
      console.log('hist weather fired');

      $http.get('/weatherInfo/hist/' + vm.latlong).then((response) => {
          var histWeatherData = response.data;
          var dailyHighTemps = histWeatherData[0];
          var dailyLowTemps = histWeatherData[1];
          var dailyHumidity = histWeatherData[2];
          var dayLabels = [];
          for (var date = 7; date >= 1; date--) {
            dayLabels.push(moment().subtract(date, 'days').format('LL'))
          }
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
      console.log(dailyHighTemps, dailyLowTemps);
      var ctx = document.getElementById('tempChart');
      var tempChart = new Chart(ctx, {
        type: 'bar',
        title: 'Daily High temperature from the last week',
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
              label: 'Daily Low Temp',
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
      console.log(data.datasets[0].data, data.datasets[1].data);
    }

    function buildHumidityChart(dayLabels, dailyHumidity) {
      var ctx = document.getElementById('humidityChart');
      var tempChart = new Chart(ctx, {
        type: 'line',
        title: 'Daily High temperature from the last week',
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
      $http.get('/database/users').then((listOfUsers) => {
          console.log(listOfUsers.data);
          vm.users = listOfUsers.data;
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function getSearchHistoryByUser(user_id) {
      $http.get('/database/search_history/' + user_id).then((response) => {
          vm.lastFiveSearches = response.data.slice(0, 5);
          console.log(vm.lastFiveSearches);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}());
