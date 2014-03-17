
module.exports = function auth (req, res, next) {
  if (!(req.session && req.session.email)) {
    return res.redirect('/login');
  }
  
  next();
}

