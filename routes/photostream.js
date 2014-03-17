var mongoose = require('mongoose');
var Photo = mongoose.model('Photo');

var auth = require('../middleware/auth');

module.exports = function (app) {
  
  /*
   * GET photostream for authenticated user
   */
  
  app.get('/', auth, function (req, res, next) {
    
    var query = {
      owner : req.session.email
    };
    
    var tags = req.param('tags');
    if (tags) {
      tags = tags.split(' ');
      
      query.tags = {
        $all : tags
      }
    }
    
    Photo.find(query).sort('created').exec(function (err, photos) {
      if (err) return next(err);
      
      res.render('photostream.jade', {
        title : req.session.name + '\'s Photostream',
        photos : photos,
        tags : tags ? tags.join(' ') : undefined
      });
    });
  });
}
