var winston = require('winston');

var mongoose = require('mongoose');
var User = mongoose.model('User');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');

module.exports = function (app) {
  
  /*
   * GET sign up
   */
  
  app.get('/signup', function (req, res) {
    res.render('signup.jade', {
      title : 'Sign up'
    });
  });
  
  /*
   * POST sign up
   */
  
  app.post('/signup', function (req, res, next) {
    var email = cleanString(req.param('email'));
    var pass = cleanString(req.param('pass'));
    var name = cleanString(req.param('name'));
    var surname = cleanString(req.param('surname'));
    var address = cleanString(req.param('address'));
    var birthDate = cleanString(req.param('birthDate'));
    var turkishIdentificationNumber = cleanString(req.param('turkishIdentificationNumber'));
    
    // checking if any of the required fields are empty
    if (!(email && pass && name && surname)) {
      return res.render('signup.jade', {
        title : 'Sign up',
        invalid : true
      });
    }
    
    // checking if there's already a user with the same email
    User.findById(email, function (err, user) {
      if (err) return next(err);
      
      if (user) {
        return res.render('signup.jade', {
          title : 'Sign up',
          exists : true
        });
      }
      
      // all seems fine, creating the user
      crypto.randomBytes(16, function (err, bytes) {
        if (err) return next(err);
        
        var user = {
          _id : email,
          name : name,
          surname : surname,
          address : address,
          birthDate : birthDate,
          turkishIdentificationNumber : turkishIdentificationNumber
        };
        
        user.salt = bytes.toString('utf8');
        user.hash = hash(pass, user.salt);
        
        User.create(user, function (err, createdUser) {
          if (err) {
            if (err instanceof mongoose.Error.ValidationError) {
              // there's database validation error
              return res.render('signup.jade', {
                title : 'Sign up',
                invalid : true
              });
            }
            
            return next(err);
          }
          
          // user is alive!
          winston.info(email + ', ' + 'sign up');
          
          req.session.authenticated = true;
          req.session.email = email;
          req.session.name = createdUser.fullname;
          
          return res.redirect('/');
        });
      });
    });
  });
  
  /*
   * GET login
   */
  
  app.get('/login', function (req, res) {
    var params = {
      title : 'Login'
    };
    
    // if in development env, filling in the form to make my life easier
    // if (app.settings.env === 'development') {
    //   console.log('Filling in dummy email/pass');
    //   
    //   params.dummyEmail = 'c@a.com';
    //   params.dummyPass = 'qwerty';
    // }
    
    res.render('login.jade', params);
  });
  
  /*
   * POST login
   */
  
  app.post('/login', function (req, res, next) {
    var email = cleanString(req.param('email'));
    var pass = cleanString(req.param('pass'));
    
    // checking if the fields are empty
    if (!(email && pass)) {
      return res.render('login.jade', {
        title : 'Login',
        invalid : true
      });
    }
    
    // converting email to lowercase, just in case
    email = email.toLowerCase();
    
    User.findById(email, function (err, user) {
      if (err) return next(err);
      
      if (!user) {
        return res.render('login.jade', {
          title : 'Login',
          invalid : true
        });
      }
      
      // found user, comparing hashes
      if (user.hash != hash(pass, user.salt)) {
        return res.render('login.jade', {
          title : 'Login',
          invalid : true
        });
      }
      
      if (user.isAdmin) {
        // we have an admin!
        req.session.authenticated = true;
        req.session.email = email;
        req.session.name = user.fullname;
        req.session.admin = true;
        
        res.redirect('/admin');
      }
      
      else {
        // all is good, setting up session params
        req.session.authenticated = true;
        req.session.email = email;
        req.session.name = user.fullname;
        
        res.redirect('/');
      }
      
      winston.info(email + ', ' + 'login');
    });
  });
};
