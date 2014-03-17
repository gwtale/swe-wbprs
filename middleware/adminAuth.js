
module.exports = function adminAuth (req, res, next) {
  if (!(req.session && req.session.email && req.session.admin)) {
    return res.redirect('/login');
  }
  
  next();
}
