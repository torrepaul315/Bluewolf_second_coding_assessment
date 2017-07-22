var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var darkSkyQueries = require('./routes/darkSkyQueries.js');
var database = require('./routes/database');
var http = require('http');

var app = express();

var Chart = require('chart.js');

//attempt to add in proxy Server
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var serverOne = 'http://localhost:3001';

app.all("/app1/*", function(req, res) {
    console.log('redirecting to Server1');
    apiProxy.web(req, res, {target: serverOne});
});
//done with proxy server seciton



// ...prolly get rid of these?
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/../', 'node_modules')))
//need to come back to this! may need to npm install more shite!
// require('dotenv').config()
//app.engine('.html', require('ejs').renderFile);


app.use('/weatherInfo', darkSkyQueries);
app.use('/database', database);


// app.use('*', function(req, res, next) {
//   res.sendFile('index.html', {root: path.join(__dirname, 'public')})
// })


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



module.exports = app;
