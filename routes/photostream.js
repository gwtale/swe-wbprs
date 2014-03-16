var auth = require('../middleware/auth');

module.exports = function (app) {
  
  /*
   * GET photostream for authenticated user
   */
  
  app.get('/', auth, function (req, res) {
    res.render('photostream.jade', {
      title : req.session.name + '\'s Photostream'
    });
  });
}
