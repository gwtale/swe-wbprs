var photostream = require('./photostream');
var login = require('./login');
// var posts = require('./posts');
var errors = require('./errors');

module.exports = function (app) {
  
  // listing photos
  photostream(app);
  
  // login / signup
  login(app);
  
  // blog post crud
  // posts(app);
  
  // error handlers
  errors(app);
}