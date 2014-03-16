var mongoose = require('mongoose');
var User = mongoose.model('Photo');

var auth = require('../middleware/auth');

var cleanString = require('../helpers/cleanString');

module.exports = function (app) {
  
  /*
   * GET upload photo
   */
  
  app.get("/photo/upload", auth, function (req, res) {
    return res.render('photo/upload.jade', {
      title : 'Upload photo'
    });
  });
  
  /*
   * POST upload photo
   */
  
  app.post("/photo/upload", auth, function (req, res, next) {
    
  });
  
  /*
   * GET photo
   */
  
  
};
