const express = require('express');
const router = express.Router();
const Taxi = require('../models/taxi.model');
const multer = require('multer');
const path = require('path');

// --- Multer configuration ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // save uploaded files here
  },
  filename: function (req, file, cb) {
    // unique filename: fieldname + timestamp + extension
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });



// Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalProducts = await Taxi.countDocuments();
   const premiumProducts = await Taxi.countDocuments({ category: { $regex: /^Premium$/i } });
const economyProducts = await Taxi.countDocuments({ category: { $regex: /^Economy$/i } });
const comfortProducts = await Taxi.countDocuments({ category: { $regex: /^Comfort$/i } });


    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      stats: { totalProducts, premiumProducts, economyProducts, comfortProducts }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


router.get('/products', async (req, res) => {
  const { category } = req.query;

  const filter = {};
  if (category) filter.category = category;

  const taxis = await Taxi.find(filter);

  res.render('admin/product_list', {
    title: 'Product List',
    taxis,
    selectedCategory: category || "All"
  });
});

// Add Product (form)
router.get('/products/add', (req, res) => {
  res.render('admin/add_product', { 
    title: 'Add Product',
    taxi: {} // pass empty object to avoid undefined
  });
});

router.post('/products/add', upload.single('image'), async (req, res) => {
  const { name, price, category, description } = req.body;
  let imagePath = '';

  if (req.file) {
    imagePath = '/images/' + req.file.filename; // save path for database
  }

  await Taxi.create({ name, price, category, description, image: imagePath });

  // console.log("After Add: ", await Taxi.find());
  res.redirect('/admin/products');
});

// Edit Product
router.get('/products/edit/:id', async (req, res) => {
  const taxi = await Taxi.findById(req.params.id);

  res.render('admin/edit_product', { title: 'Edit Product', taxi });
});

// Edit POST
router.post('/products/edit/:id', upload.single('image'), async (req, res) => {
  const { name, price, category, description } = req.body;
  let updateData = { name, price, category, description };

  if (req.file) {
    updateData.image = '/images/' + req.file.filename;
  }

  await Taxi.findByIdAndUpdate(req.params.id, updateData);

  // console.log("After Edit: ", await Taxi.find());
  res.redirect('/admin/products');
});

// Delete Product
router.post('/products/delete/:id', async (req, res) => {
  await Taxi.findByIdAndDelete(req.params.id);

  
  res.redirect('/admin/products');
});

module.exports = router;
