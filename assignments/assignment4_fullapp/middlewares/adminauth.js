
function isAdmin(req, res, next) {
  if (!req.session.user) {
    
    return res.redirect('/auth/login');
  }

  const roles = req.session.user.roles || [];
  

  if (!roles.includes('admin')) {
    
    return res.status(403).send('Access Denied: Admins only');
  }

  console.log("✅ Admin access granted");
  next();
}

function checkSessionAuth2(req, res, next) {
  if (!req.session.user) {

    return res.redirect('/auth/login');
  }

  next();
}

module.exports = { checkSessionAuth2, isAdmin };

