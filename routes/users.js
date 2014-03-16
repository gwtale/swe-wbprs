var mongoose = require('mongoose');
var User = mongoose.model('User');
var Photo = mongoose.model('Photo');

var auth = require('../middleware/auth');

var cleanString = require('../helpers/cleanString');

module.exports = function (app) {
  
  /*
   * GET search user
   */
  
  app.get("/user/search", auth, function (req, res, next) {
    var query = cleanString(req.param('query'));
    
    if (query.length > 0) {
      User.find({
        surname : new RegExp('^' + query)
      }, function (err, users) {
        if (err) return next(err);
        
        res.render('user/search.jade', {
          title : 'Search Results',
          query : query,
          users : users
        });
      });
    }
    
    else {
      User.find({}, function (err, users) {
        if (err) return next(err);
        
        res.render('user/search.jade', {
          title : 'Users',
          users : users
        });
      });
    }
  });
  
  /*
   * GET user photostream
   */
  
  app.get('/user/:id', auth, function (req, res, next) {
    var id = req.param('id');
    
    // redirecting to root if the queried id is current user's id
    if (id == req.session.email) {
      return res.redirect("/");
    }
    
    User.findById(id, function (err, user) {
      if (err) return next(err);
      
      if (!user) return next(); // 404
      
      Photo.find({
        owner : user.id,
        isPrivate : false
      }).sort('created').exec(function (err, photos) {
        if (err) return next(err);
        
        res.render('photostream.jade', {
          title : user.fullname + '\'s Photostream',
          user : user,
          photos : photos
        });
      });
    });
  });
};
