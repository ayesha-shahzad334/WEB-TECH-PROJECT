const mongoose = require("mongoose");
const taxiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  description: { type: String },
  image: { type: String } 
}, { timestamps: true });


const Taxi = mongoose.model("Taxi", taxiSchema);


module.exports = Taxi;
