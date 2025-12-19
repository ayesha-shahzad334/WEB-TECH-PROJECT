function checkCartNotEmpty(req, res, next) {
  const cart = req.session.cart;
  if (!cart || cart.items.length === 0) {
    return res.redirect('/cart');
  }
  next();
}



module.exports = { checkCartNotEmpty };
