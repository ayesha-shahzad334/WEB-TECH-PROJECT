// POST /checkout
// This route handles the final order placement.
// It receives the customer's details and payment info from the form,
// validates them, saves a new order in the database, clears the session cart,
// and redirects the user to the order confirmation page.


const express = require('express');
const router = express.Router();
const Order = require('../models/ordermodel.js');
const { checkCartNotEmpty } = require('../middlewares/protect'); 


router.get('/checkout', checkCartNotEmpty, (req, res) => {
  const cart = req.session.cart;

  res.render('checkout', {
    cart,
    title: 'Checkout'
  });
});

router.post('/checkout', async (req, res) => {
  const { customerName, email, phone, address, paymentMethod } = req.body;
  const cart = req.session.cart;

  if (!cart || cart.items.length === 0) {
    return res.redirect('/cart');
  }

  // Server-side validation
  if (!customerName || !email || !phone || !address || !paymentMethod) {
    return res.status(400).send('All fields are required!');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Invalid email format');
  }

  try {
    const newOrder = new Order({
      customerName,
      email,
      phone,
      address,
      paymentMethod,
      items: cart.items,
      totalAmount: cart.totalPrice,
      status: 'Pending',
      createdAt: new Date()
    });

    const savedOrder = await newOrder.save();

    req.session.cart = { items: [], totalQty: 0, totalPrice: 0 };

    res.redirect(`/order/confirmation/${savedOrder._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error placing order');
  }
});

router.get('/order/confirmation/:id', async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.send('Order not found');

    res.render('orderconfirmation', { 
      order,
      title: 'Order Confirmation'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading order confirmation page');
  }
});
 
module.exports = router;
