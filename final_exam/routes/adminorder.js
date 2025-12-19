const express = require('express');
const router = express.Router();
const Order = require('../models/ordermodel.js');
const { checkSessionAuth2, isAdmin } = require('../middlewares/adminauth');

router.get('/orders', isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render('admin/orders', { orders, title: 'Admin Orders' });
  } catch (err) {
    console.error(err);
    res.send('Error fetching orders');
  }
});


router.post('/orders/update/:id', isAdmin, async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body; // "Confirmed" or "Cancelled"

  try {
    await Order.findByIdAndUpdate(orderId, { status });
    res.redirect('/admin/orders');
  } catch (err) {
    console.error(err);
    res.send('Error updating order status');
  }
});

module.exports = router;
