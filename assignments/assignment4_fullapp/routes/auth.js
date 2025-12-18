const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/usermodel');


router.get('/register', (req, res) => {

  res.render('register', { title: 'Register', error: null });
});


router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
 
  try {
    const existingUser = await User.findOne({ email });
    

    if (existingUser) {
      return res.render('register', { title: 'Register', error: 'Email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      roles: ['user'] 
    });

    await user.save();
    
    res.redirect('/auth/login');
  } catch (err) {
   
    res.status(500).send('Server Error');
  }
});


router.get('/login', (req, res) => {

  res.render('login', { title: 'Login', error: null });
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  

  try {

    const user = await User.findOne({ email }).lean();

    

    if (!user) {
      return res.render('login', { title: 'Login', error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    

    if (!isMatch) {
      return res.render('login', { title: 'Login', error: 'Invalid email or password' });
    }

    
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: Array.isArray(user.roles) ? user.roles : []

    };
     if (!user.roles) {
  console.warn("⚠ User has NO roles in DB:", user.email);
}

    

    
    if (req.session.user.roles.includes('admin')) {
      
      return res.redirect('/admin/dashboard');
    } else {
      
      return res.redirect('/');
    }

  } catch (err) {
   
    res.status(500).send('Server Error');
  }
});


router.get('/logout', (req, res) => {
  console.log(" GET /auth/logout called, destroying session:", req.session.user);
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
