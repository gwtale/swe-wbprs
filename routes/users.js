var mongoose = require('mongoose');
var User = mongoose.model('User');
var Photo = mongoose.model('Photo');

var auth = require('../middleware/auth');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');

module.exports = function (app) {
  
  /*
   * GET user edit
   */
  
  app.get("/user/edit", auth, function (req, res, next) {
    
    User.findById(req.session.email, function (err, user) {
      if (err) return next(err);
      
      res.render('user/edit.jade', {
        title : 'Edit Profile',
        user : user
      });
    });
  });
  
  /*
   * POST user edit
   */
  
  app.post("/user/edit", auth, function (req, res, next) {
    // TODO: Reuse signup!
    
    var email = req.session.email;
    
    var pass = cleanString(req.param('pass'));
    var name = cleanString(req.param('name'));
    var surname = cleanString(req.param('surname'));
    var address = cleanString(req.param('address'));
    var birthDate = cleanString(req.param('birthDate'));
    var turkishIdentificationNumber = cleanString(req.param('turkishIdentificationNumber'));
    
    // checking if any of the required fields are empty
    if (!(pass && name && surname)) {
      return invalid();
    }
    
    // all seems fine, creating the user
    crypto.randomBytes(16, function (err, bytes) {
      if (err) return next(err);
      
      var user = {
        name : name,
        surname : surname,
        address : address,
        birthDate : birthDate,
        turkishIdentificationNumber : turkishIdentificationNumber
      };
      
      user.salt = bytes.toString('utf8');
      user.hash = hash(pass, user.salt);
      
      User.findByIdAndUpdate(email, user, function (err, createdUser) {
        if (err) {
          if (err instanceof mongoose.Error.ValidationError) {
            // there's database validation error
            return invalid();
          }
          
          return next(err);
        }
        
        // user is alive!
        console.log('User profile edited w/ email: %s', email);
        
        req.session.authenticated = true;
        req.session.email = email;
        req.session.name = createdUser.fullname;
        
        return res.redirect('/');
      });
    });
    
    function invalid () {
      User.findById(req.session.email, function (err, user) {
        if (err) return next(err);
        
        var params = {
          title : 'Edit Profile',
          user : user,
          invalid : true
        };
        
        return res.render('user/edit.jade', params);
      });
    }
  });
  
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
    var tags = req.param('tags');
    
    // redirecting to root if the queried id is current user's id
    if (id == req.session.email) {
      return res.redirect("/");
    }
    
    var query = {
      owner : id
    };
    
    // admins can see all the photos
    if (!req.session.admin) {
      query.isPrivate = false;
    }
    
    if (tags) {
      tags = tags.split(' ');
      
      query.tags = {
        $all : tags
      }
    }
    
    User.findById(id, function (err, user) {
      if (err) return next(err);
      
      if (!user) return next(); // 404
      
      Photo.find(query).sort('created').exec(function (err, photos) {
        if (err) return next(err);
        
        res.render('photostream.jade', {
          title : user.fullname + '\'s Photostream',
          user : user,
          photos : photos,
          tags : tags ? tags.join(' ') : undefined
        });
      });
    });
  });
};
