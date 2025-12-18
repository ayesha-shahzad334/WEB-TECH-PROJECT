const express = require('express');
const router = express.Router();
const Taxi = require('../models/taxi.model');

// Public products page
router.get('/', async (req, res) => {
  try {
    let { page = 1, limit = 10, category, minPrice, maxPrice } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};

    if (category) filter.category = category;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const taxis = await Taxi.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Taxi.countDocuments(filter);

    res.render('products', {
      title: 'Products',
      taxis,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      filters: { category, minPrice, maxPrice }
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
