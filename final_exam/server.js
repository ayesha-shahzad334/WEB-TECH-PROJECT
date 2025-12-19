const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const config = require('./config.json');

const pageRoutes = require('./routes/pages');
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const adminOrdersRoutes = require('./routes/adminorder');

const { checkSessionAuth2, isAdmin } = require('./middlewares/adminauth');
const { sessionAuth } = require('./middlewares/sessionAuth');

const app = express();
const PORT = config.port || 3000;

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files & EJS layouts
app.use(express.static('public'));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layout');

// Session setup
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,  
  cookie: { maxAge: 1000 * 60 * 60 }
}));

// Custom session auth middleware
app.use(sessionAuth);

// Debug session
app.get('/debug-session', (req, res) => {
  res.json(req.session.user || null);
});

// Public routes
app.use('/', pageRoutes);
app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/', checkoutRoutes);

// Admin routes with layout and auth
app.use(
  '/admin',
  checkSessionAuth2,
  isAdmin,
  (req, res, next) => {                                //email is "mahakaleem@gmail.com              
 res.locals.layout = 'admin-layout';                   // password is '12345'
    next();
  },
  adminRoutes,
  adminOrdersRoutes
);

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

// MongoDB connection
mongoose.connect(config.db)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
