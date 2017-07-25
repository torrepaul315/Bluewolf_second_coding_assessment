var chai = require('chai');
var assert = chai.assert;
var express = require('express');
var router = express.Router();

// var frontEnd = require('../public');
var database = require('../routes/database.js');

var http = require('http');
var fetch = require('node-fetch');

// describe('Array', function() {
//   it()
// })
//how do you implement tests in angular!?!

//deepEqual

describe('Array', function() {
  it('should be an array with length 3', function() {
   return http.get('http://10.2.12.251:3000/database/users', (res) => {
          console.log(res);
          assert.isArray(json, 'expected result to be an array');
          assert.equal(9,10,'expected result to have a length of three');
        });




  });
});


// describe('get users in the database', function() {
//   it('should get back an object with a lot of info ', function() {
//     fetch('/database/users').then((listOfUsers) => {
//         console.log(listOfUsers.data);
//         vm.users = listOfUsers.data;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//
//     assert.equal(arr.length, 0);
//   });
// });
