const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const config = require('./config.json');
const Taxi = require('./models/taxi.model'); 

const app = express();
const PORT = config.port || 3000;


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); 
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


mongoose.connect(config.db)
  .then(() => console.log("✔ Connected to MongoDB"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));




app.get('/', async (req, res) => {
  try {
    const taxis = await Taxi.find(); // fetch all products
    res.render('homepage', { title: 'Order Taxi', taxis });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


app.get('/products', async (req, res) => {
  try {
    let { page = 1, limit = 10, category, minPrice, maxPrice } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

   
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);

    
    const taxis = await Taxi.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    
    const total = await Taxi.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.render('products', {
      title: 'Products',
      taxis,
      currentPage: page,
      totalPages,
      filters: { category, minPrice, maxPrice }
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});




app.get('/checkout', (req, res) => {
  res.render('checkout', { title: 'Checkout' });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
