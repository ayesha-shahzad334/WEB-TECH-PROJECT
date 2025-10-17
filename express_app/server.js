const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

const PORT = 3000;


app.set('view engine', 'ejs');
app.use(expressLayouts);


app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('homepage', { title: 'Order Page' });
});



app.get('/checkout', (req, res) => {
  res.render('checkout', { title: "Checkout Page" });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
