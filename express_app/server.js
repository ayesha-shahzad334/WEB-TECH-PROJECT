const express = require('express');
const mongoose = require("mongoose");
const app = express();
const expressLayouts = require('express-ejs-layouts');
var ProductModel = require("./models/product.model");
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/productDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});



app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.json());
app.use(express.static('public'));




app.get("/api/products", async (req, res) => {
  const products = await ProductModel.find();
  res.send(products);
});

app.get("/api/products/:id", async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  res.send(product);
});

app.delete("/api/products/:id", async (req, res) => {
  const product = await ProductModel.findByIdAndDelete(req.params.id);
  res.send(product);
});

app.post("/api/products", async (req, res) => {
  let data = req.body;
  let record = new ProductModel(data);
  await record.save();
  res.send(record);
});

app.put("/api/products/:id", async (req, res) => {
  let data = req.body;
  // let record = await ProductModel.findByIdAndUpdate(req.params.id, data, {
  //   new: true,
  // });
  let record = await ProductModel.findById(req.params.id);
  record.name = data.name;
  record.price = data.price;
  record.description = data.description;
  await record.save();
  res.send(record);
});

// app.get('/', (req, res) => {
//   res.render('homepage', { title: 'Order Page' });
// });

// app.get('/checkout', (req, res) => {
//   res.render('checkout', { title: "Checkout Page" });
// });


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
