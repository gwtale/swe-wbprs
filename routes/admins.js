var mongoose = require('mongoose');
var User = mongoose.model('User');
var Photo = mongoose.model('Photo');

var adminAuth = require('../middleware/adminAuth');


module.exports = function (app) {
  
  /*
   * GET admin panel
   */
   
  app.get("/admin", adminAuth, function (req, res, next) {
    
    User.find({}, function (err, users) {
      if (err) return next(err);
      
      Photo.find({}, function (err, photos) {
        if (err) return next(err);
        
        res.render('admin.jade', {
          title : 'Admin Panel',
          users : users,
          photos : photos
        });
      });
    });
  });
};
