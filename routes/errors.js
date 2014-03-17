var winston = require('winston');

module.exports = function (app) {
  
  // 404
  app.use(function (req, res, next) {
    var status = 404;
    res.status(status);
    
    return res.render('error.jade', {
      title : status,
      message : "Bzzt.. Our robots are very sorry, they can't find this page."
    });
  });
  
  // 500
  app.use(function (err, req, res, next) {
    winston.error(req.session.user + ', ' + req.url + ', ' + err.stack);
    
    var status = 500;
    res.status(status);
    
    return res.render('error.jade', {
      title : status,
      message : "Bzzt.. Our robots are very sorry, something went wrong."
    });
  });
};
