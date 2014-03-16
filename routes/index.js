var photostream = require('./photostream');
var login = require('./login');
var photos = require('./photos');
var users = require('./users');
var errors = require('./errors');

module.exports = function (app) {
  
  // listing photos
  photostream(app);
  
  // login / signup
  login(app);
  
  // photo crud
  photos(app);
  
  // user
  users(app);
  
  // error handlers
  errors(app);
}
