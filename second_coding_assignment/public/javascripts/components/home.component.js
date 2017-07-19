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

        findWeather(latitude, longitude);
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
  function findWeather(lat, long) {
    console.log('time to actually hit the api!');
//https://api.darksky.net/forecast/[key]/[latitude],[longitude],[time]
    $http.get(`/weatherInfo`).then((response) => {
          console.log(response);
          //postObj.comments.push(cObj);
          // $http.get(`/api/posts/${postObj.id}`)
          // .then((post)=>{
          //   console.log(post.data)
          //   $http.get(`/api/comments/${postObj.id}/comments`)
          //   .then((postComments) => {
          //   console.log(postComments.data)
          //
          //delete vm.newComment;
          //   })
          // })
        })
        .catch((err) => {
         console.log(err);
        });


  }







// mah functions!
      vm.toggleNewPost = function(){
        // console.log("linked!");
        vm.newPostVis = !vm.newPostVis;
        //  $scope.newPostVis ? true : false;
      }
      vm.toggleComments = function(post){
        console.log("linked!");
        post.commentsVis = !post.commentsVis;
      }


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
