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
      var pastWkLoHiTemp = []


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
      vm.posts.push(geoCode);
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
          // var unixMinusAday = currentTimeInUnix - 86400;
          // var unixMinusaMonth = currentTimeInUnix - 2851200;
          // var timeScrub =  moment.unix(currentTimeInUnix);
          // var dayback = moment.unix(unixMinusAday);
          // var monthBack = moment.unix(unixMinusaMonth);

          getPastWeekWeather(currentTimeInUnix);
        //  vm.weatherInfoCurrent = response;
        })
        .catch((err) => {
         console.log(err);
        });
  }

  function getPastWeekWeather(UnixStartPoint) {
     for (var x = 0; x < 7; x++) {
       UnixStartPoint -= 86400;
       var dsHistWeather = latlong + ','+ UnixStartPoint
       //console.log(latlong,UnixStartPoint);
       $http.get('/weatherInfo/'+ dsHistWeather).then((response) => {
             var dailyMax = response.data.daily.data[0].temperatureMax;

            var dailyMin = response.data.daily.data[0].temperatureMin;
            //  console.log('dailyMax', dailyMax,
            //  'dailyMin', dailyMin    )
            //  latlong
             var dailyLoHi = {};
             dailyLoHi.min = dailyMin;
             dailyLoHi.max = dailyMax;
             //console.log(dailyLoHi);
             pastWkLoHiTemp.push(dailyLoHi)


           //  vm.weatherInfoCurrent = response;
           })
           .catch((err) => {
            console.log(err);
           });



     }
     pastWkLoHiTemp.reverse()
     console.log(pastWkLoHiTemp);
  }

// where I start my chart.js adventure!
        // var ctx = document.getElementById("myChart");
        // console.log(ctx);
        // var myChart = new Chart(ctx, {
        //     type: 'bar',
        //     data: {
        //         labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        //         datasets: [{
        //             label: '# of Votes',
        //             data: [12, 19, 3, 5, 2, 3],
        //             backgroundColor: [
        //                 'rgba(255, 99, 132, 0.2)',
        //                 'rgba(54, 162, 235, 0.2)',
        //                 'rgba(255, 206, 86, 0.2)',
        //                 'rgba(75, 192, 192, 0.2)',
        //                 'rgba(153, 102, 255, 0.2)',
        //                 'rgba(255, 159, 64, 0.2)'
        //             ],
        //             borderColor: [
        //                 'rgba(255,99,132,1)',
        //                 'rgba(54, 162, 235, 1)',
        //                 'rgba(255, 206, 86, 1)',
        //                 'rgba(75, 192, 192, 1)',
        //                 'rgba(153, 102, 255, 1)',
        //                 'rgba(255, 159, 64, 1)'
        //             ],
        //             borderWidth: 1
        //         }]
        //     },
        //     options: {
        //         scales: {
        //             yAxes: [{
        //                 ticks: {
        //                     beginAtZero:true
        //                 }
        //             }]
        //         }
        //     }
        // });






// mah functions!


      vm.createNewPost = function(){

        vm.newPostForm.$setPristine();
        vm.newPost.created_at = moment().calendar();
        vm.newPost.vote_count = 0;
        /* you need to hit the comments table upon a successful response from the post request for a new comment!*/

        // vm.newPost.comments = 0;

        console.log(vm.newPost);

        $http.post('api/posts', vm.newPost)
        .then((resp)=> {
           console.log(resp);
           $http.get('/api/posts')
           .then((postsInDb) => {
             console.log(postsInDb.data);
             vm.posts = postsInDb.data;
             vm.posts.created_at = moment().format(`{postsInDb.data.created_at}`);
          })
          .catch((err) => {
            console.log(err);
          });
        })
        console.log(vm.posts);
        delete vm.newPost
        vm.newPostVis = !vm.newPostVis;
      }



    }



}());

// vm.posts =[
//   {
//   title: "titlechange!",
//   author: "Linus Lane",
//   image: "https://scontent-lga3-1.cdninstagram.com/hphotos-xft1/t51.2885-15/e35/11809944_1676694042554573_495250395_n.jpg",
//   body: "Hey, hey, we're the Monkees, and people say we monkey around. But we're too busy singing to put anybody down. We're just tryin' to be friendly, come and watch us sing and play. We're the young gneration, and we've got something to say.",
//   time: moment().subtract(5,'days').calendar(),
//   counter:5,
//   comments: [
//   {comment:"monkeys are awesome but not as cool as birds"}
//   ]},
//   {title: "Monkey costumes are totally in this season",
// author: "Linus Lane",
// image: "https://scontent-lga3-1.cdninstagram.com/hphotos-xft1/t51.2885-15/e35/11809944_1676694042554573_495250395_n.jpg",
// body: "Hey, hey, we're the Monkees, and people say we monkey around. But we're too busy singing to put anybody down. We're just tryin' to be friendly, come and watch us sing and play. We're the young gneration, and we've got something to say.",
// time: moment().subtract(14,'days').calendar(),
//
// counter:0,
// comments: [{
//   comment:"I don't like monkeys!"
// },
// {comment:"monkeys are awesome but not as cool as birds"}]
//   }
// ]
