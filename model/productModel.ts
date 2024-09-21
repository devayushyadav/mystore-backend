const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Store the base64 string or a URL if you're storing it elsewhere
    required: true,
  },
}, { timestamps: true }); // This adds createdAt and updatedAt fields

// Correct the model caching logic to avoid re-registering the model
const Products =
  mongoose.models.Products || mongoose.model("Products", productSchema);

export default Products;