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
// keep your variables up here!
      const vm = this;
      // console.log('sanity check');
      vm.newPostVis = false;
      vm.commentsVis =false;
      vm.orderByVal = '-vote_count';
      vm.counter=0;
      // vm.fields = ['votes', 'date', 'title'];

      // vm.posts = [];
      // console.log(vm.posts);
      // vm.$onInit = function () {
      //   $http.get('/api/posts')
      //   .then( function (postsInDb) {
      //     vm.posts = postsInDb.data;
      //      console.log(vm.posts,vm.posts[0].comments, vm.posts[0].comments[1].content);
      //   })
      // }







// mah functions!
      vm.toggleNewPost = function(){
        // console.log("linked!");
        vm.newPostVis = !vm.newPostVis;
        //  $scope.newPostVis ? true : false;
      }
      vm.toggleComments = function(post){
        // console.log("linked!");
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


      vm.createNewComment= function(postObj){

        console.log(1,postObj.id,         2,postObj,
        3,postObj.comments,
        4, vm.newComment,
        6, postObj.commentsVis
        )

        var cObj = {
          content: vm.newComment,
          post_id: postObj.id
        };
        console.log(cObj);



        //had a struggle point here- can add comment to db, but then I also need to update the comments list! was trying to update to the array of the posts object by pushing the comment , but the more I thought about it and looked at the content of the comments array, it seemed to make more sense to try a get request for the blogpost comments by id, then look to tap into that ng-repeat or that specific post!
        $http.post(`/api/comments/${postObj.id}/comments`, cObj)
        .then((data) => {
          console.log(data);
          postObj.comments.push(cObj);
          // $http.get(`/api/posts/${postObj.id}`)
          // .then((post)=>{
          //   console.log(post.data)
          //   $http.get(`/api/comments/${postObj.id}/comments`)
          //   .then((postComments) => {
          //   console.log(postComments.data)
          //
          delete vm.newComment;
          //   })
          // })
        })
        .catch((err) => {
         console.log(err);
        });
      }
      // I am altering the contents of the posts object in the line below...(or so I think! shouldn't that change trigger the generated ng-repreat?)
      // vm.posts[`${post-1}`].comments.push(vm.newComment);
      // console.log(vm.posts[`${postId}`].comments);
      //come back to tweak!
      // $http.get(`/api/comments/${postObj.id}/comments`)
      // //
      // .then((data) =>{
      // // console.log(data.data);
      // vm.posts[postId].comments = data.data;
      // console.log(vm.posts[postId].comments);




//getting closer here! but page gets a lil cray once you start clicking...might need to try to use the response and/or just get that particular post to update tally? can get them all back but that seems a tad excessive!

//tweaked how the upvote works that said....might/might not solve yo issue of the tally seeming kind of nuts!

      vm.increment = function(post) {
        console.log(post.id);
        $http.post(`/api/posts/${post.id}/votes`)
        .then((resp)=> {
           console.log(resp);
           //may need to switch back to the get all posts route!
           $http.get('/api/posts/' + post.id)
           .then((postsInDb) => {
             console.log(postsInDb.data);
             post.vote_count = postsInDb.data.vote_count;
          })
          .catch((err) => {
            console.log(err);
          });
        })
      }

      vm.decrement = function(post) {
        console.log(1,post, 2,post.vote_count);
        if (post.vote_count <= 0 ){
          alert("sorry- vote numbers cant go negative because we're positive :-)");
          }
        else {
          $http.delete(`/api/posts/${post.id}/votes`)
          .then((resp)=> {
             console.log(resp);
             $http.get('/api/posts')
             .then((postsInDb) => {
               console.log(postsInDb.data);
               vm.posts = postsInDb.data;

            })
            .catch((err) => {
              console.log(err);
            });

          })
        }
      }

      vm.deletePost = function(id) {
        console.log("id is", id);

        $http.delete('api/posts/'+ id)
        .then((data) => {
          console.log(data);
          $http.get('/api/posts')
          .then((postsInDb) => {
            console.log(postsInDb.data);
            vm.posts = postsInDb.data;
          })
        })
        .catch((err) => {
         console.log(err);
        });

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
