var express = require('express');
var mongoose = require('mongoose');
var winston = require('winston');
var moment = require('moment');

var models = require('./models');
var middleware = require('./middleware');
var routes = require('./routes');

mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/wbprs', function (err) {
  if (err) throw err;
  
  winston.remove(winston.transports.Console);
  winston.add(winston.transports.File, {
    filename : 'wbprs-log.txt',
    json : false,
    timestamp : function() {
      return moment().format('YYYYMMDD-HHmmss-SSS');
    }
  });
  
  var app = express();
  middleware(app);
  routes(app);
  
  app.listen(3000, function () {
    winston.info('WBPRS now listening on port 3000');
  }); 
});
