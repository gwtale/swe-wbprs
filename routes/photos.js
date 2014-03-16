var mongoose = require('mongoose');
var Photo = mongoose.model('Photo');

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
    var title = cleanString(req.param('title'));
    var tags = cleanString(req.param('tags')).split(' ');
    var user = req.session.email;
    
    Photo.create({
      title : title,
      tags : tags,
      owner : user
     }, function (err, photo) {
       if (err) return next(err);
       
       console.log('Uploaded new photo w/ id: ' + photo._id);
       
       res.redirect("/");
    });
  });
  
  /*
   * GET edit photo
   */
  
  app.get("/photo/edit/:id", auth, function (req, res, next) {
    var id = req.param('id');
    
    var query = Photo.findById(id);
    query.exec(function (err, photo) {
      if (err) return next(err);
      
      if (!photo) return next(); // 404
      
      res.render('photo/edit.jade', {
        title : 'Edit ' + photo.title,
        photo : photo
      });
    });
  });
  
  /*
   * POST edit photo
   */
  
  app.post("/photo/edit/:id", auth, function (req, res, next) {
    var id = req.param('id');
    
    var title = cleanString(req.param('title'));
    var tags = cleanString(req.param('tags')).split(' ');
    var isPrivate = (req.param('isPrivate') === undefined) ? false : true
    var user = req.session.email;
    
    var query = {
      _id : id,
      owner : user
    };
    
    var update = {};
    update.title = title;
    update.tags = tags;
    update.isPrivate = isPrivate;
    
    Photo.update(query, update, function (err, numAffected) {
      if (err) return next(err);
    
      if (0 === numAffected) {
        return next(new Error('No photo to edit?!'));
      }
      
      res.redirect("/photo/" + id);
    })
  });
  
  /*
   * GET delete photo -- TODO: This is baaad, should've used DELETE
   *                           but I'm in a hurry *sadface*
   */
  
  app.get("/photo/delete/:id", auth, function (req, res, next) {
    var id = req.param('id');
    var user = req.session.email;
    
    var query = {
      _id : id,
      owner : user
    };
    
    Photo.remove(query, function (err, numAffected) {
      if (err) return next(err);
    
      if (0 === numAffected) {
        return next(new Error('No photo to delete?!'));
      }
      
      res.redirect("/");
    })
  });
  
  /*
   * GET photo
   */
  
  app.get("/photo/:id", auth, function (req, res, next) {
    var id = req.param('id');
    
    var query = Photo.findById(id).populate('owner');
    query.exec(function (err, photo) {
      if (err) return next(err);
      
      if (!photo) return next(); // 404
      
      res.render('photo/view.jade', {
        title : photo.title,
        photo : photo,
        owned : (photo.owner.id === req.session.email)
      });
    });
  });
};
