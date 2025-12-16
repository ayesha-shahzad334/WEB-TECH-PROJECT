const mongoose = require("mongoose");

// Create schema
const taxiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  description: { type: String },
  image: { type: String } // URL or path to image
}, { timestamps: true });

// Create model
const Taxi = mongoose.model("Taxi", taxiSchema);

// Export model
module.exports = Taxi;
