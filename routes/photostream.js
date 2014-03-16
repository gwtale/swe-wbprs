var mongoose = require('mongoose');
var Photo = mongoose.model('Photo');

var auth = require('../middleware/auth');

module.exports = function (app) {
  
  /*
   * GET photostream for authenticated user
   */
  
  app.get('/', auth, function (req, res, next) {
    
    Photo.find({
      owner : req.session.email
    }).sort('created').exec(function (err, photos) {
      if (err) return next(err);
      
      res.render('photostream.jade', {
        title : req.session.name + '\'s Photostream',
        photos : photos
      });
    });
  });
}
