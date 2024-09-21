const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: String, required: true },
        company: { type: String, required: true },
        category: { type: String, required: true },
        color: { type: String, required: true },
        image: { type: Buffer, required: true }
    },
  { timestamps: true }
);

// Correct the model caching logic to avoid re-registering the model
const Products =
  mongoose.models.Products || mongoose.model("Products", productSchema);

export default Products;