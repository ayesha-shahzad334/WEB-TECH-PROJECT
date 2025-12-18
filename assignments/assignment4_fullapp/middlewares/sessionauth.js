

function sessionAuth(req, res, next) {
  res.locals.user = req.session.user || null;

  const path = req.originalUrl || "";


  const publicRoutes = [
    '/',
    '/products',
    '/checkout',
    '/auth/login',
    '/auth/register'
  ];

   if (publicRoutes.includes(path)) {
    return next();
  }

  next();
}

function checkSessionAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

module.exports = { sessionAuth, checkSessionAuth };
