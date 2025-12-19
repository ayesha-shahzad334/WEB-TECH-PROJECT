const express = require('express');
const router = express.Router();

router.post('/add/:id', (req, res) => {
  const product = req.body.product;

  if (!product || !product._id) {
    console.log('No product sent in form!');
    return res.redirect('/products');
  }

  if (!req.session.cart) {
    req.session.cart = { items: [], totalQty: 0, totalPrice: 0 };
  }

  const cart = req.session.cart;

  // Check if product is already in cart
  const existingItem = cart.items.find(item => item.productId === product._id);

  if (existingItem) {
    existingItem.quantity += 1; // Increase quantity for duplicate
  } else {
    cart.items.push({
      productId: product._id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1
    });
  }
   
  // Fix: recalculate total price in case quantity changes or products are removed
  cart.totalQty = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  console.log('Cart after add:', cart); // Debug

  res.redirect('/cart');
});

router.get('/', (req, res) => {
  res.render('cart', {
    cart: req.session.cart,
    title: 'Your Cart'
  });
});

module.exports = router;
