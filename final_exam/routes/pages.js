const express = require('express');
const router = express.Router();
const Taxi = require('../models/taxi.model');
// const { checkSessionAuth } = require('../middlewares/sessionAuth');


// Home page
router.get('/', async (req, res) => {
  try {
    const taxis = await Taxi.find();
    res.render('homepage', {
      title: 'Order Taxi',
      taxis
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// // Checkout page
// router.get('/checkout', (req, res) => {
//   res.render('checkout', {
//     title: 'Checkout'
//   });
// });

module.exports = router;
