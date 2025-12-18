const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const config = require('./config.json');


const pageRoutes = require('./routes/pages');
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');


const { checkSessionAuth2, isAdmin } = require('./middlewares/adminauth');
const { sessionAuth } = require('./middlewares/sessionAuth');


const app = express();
const PORT = config.port || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layout');


app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));


app.use(sessionAuth);


app.get('/debug-session', (req, res) => {
  res.json(req.session.user || null);
});


app.use('/', pageRoutes);
app.use('/products', productRoutes);


app.use('/auth', authRoutes);


app.use(
  '/admin',
  checkSessionAuth2,
  isAdmin,
  (req, res, next) => {
    res.locals.layout = 'admin-layout';
    next();
  },
  adminRoutes
);


app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});


mongoose.connect(config.db)
  .then(() => console.log(' Connected to MongoDB'))
  .catch(err => console.error(' MongoDB error:', err));


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
