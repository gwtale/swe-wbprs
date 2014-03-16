var express = require('express');
var mongoose = require('mongoose');

var models = require('./models');
var middleware = require('./middleware');
var routes = require('./routes');

mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/wbprs', function (err) {
  if (err) throw err;
  
  var app = express();
  middleware(app);
  routes(app);
  
  app.listen(3000, function () {
    console.log('WBPRS now listening on port 3000');
  }); 
});
