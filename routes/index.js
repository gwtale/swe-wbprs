var photostream = require('./photostream');
var login = require('./login');
var photos = require('./photos');
var errors = require('./errors');

module.exports = function (app) {
  
  // listing photos
  photostream(app);
  
  // login / signup
  login(app);
  
  // photo crud
  photos(app);
  
  // error handlers
  errors(app);
}
