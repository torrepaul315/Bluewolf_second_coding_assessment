# Bluewolf_second_coding_assessment

🎉Hello and thanks for taking the time to review my coding assessment!🎉

If you are in here reviewing this code well...I hope I have the opportunity to meet you in person!

This is Skycast Weather, a fullstack basic weather info application at the prototype stage.
Technologies used in this project include- Javascript, AngularJS, Node/Express, postgreSQL, Knex, Moment.js, material design Boostrap, and ChartJS.

I also us Google Maps and the Google Maps geolocation APIs to receive weather data from the DarkSky weather API.

You can view the following version of this site at:
 https://bluewolf-skycast.herokuapp.com/

if you would like to run this app locally, you may already have the files open on your computer.  Alternatively, you could fork and clone this repo on GitHub( url: https://github.com/torrepaul315/Bluewolf_second_coding_assessment)
once you have the app on your computer, run:
'npm install'
assuming that you have postgreSQL on your machine, your next step is to run:
'knex migate:latest'
followed by:
'knex seed:run'
this will get the database up, and your last step is to run:
'nodemon'
to get the app up and running on localhost:3000.

Enjoy!

At the end of any project, it's hard not to look back and see additional features/ways to improve this application
1- redesign db to save lat and long of places searched.  Doing this would reduced the number of api calls out to google.
2- Improve back end error handling.  Improve both the kinds of logs on the backend as well as at least some contingencies if one or more of the apis are down
3- Integrate this app into Salesforce with Heroku connect so that the backend functionality can be used with a salesforce instance.


Additional notes-

Based on what I have built thus far, I believe I should have the basic requirements met for this project.  As far as the bonus criteria are concerned, I have only been able to fully complete one of the three bonus criteria.  Outside of taking this project beyond a basic prototype stage, I will continue to work on building out well designed tests and work on successfully integrating a resource pre-compiler.  As I continue to refactor, I will look at breaking out the Angular component into possibly multiple compontents as a best practice.  That said, given that all of the requirements could be met on a single page of a "single page app", that did not seem essential for this prototype.
