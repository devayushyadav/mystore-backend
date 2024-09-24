import mongoose from "mongoose";
import Products from "../model/productModel";

// Fetch all products from the database
export const products = async (req, res) => {
  try {
    // Find all products
    const product = await Products.find();

    // Return the list of products in the response
    res.status(201).json({
      success: true,
      product: product,
    });
  } catch (error) {
    // Log and handle any errors that occur while fetching the products
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add a new product to the database
export const addProduct = async (req, res) => {
  try {
    // Destructure the product details from the request body
    const { name, price, company, category, color } = req.body;

    // Get the authenticated user's data from the request object
    const { user } = req.user;
    const userId = user._id; // User ID of the authenticated user

    // Initialize an array to store any validation errors
    let errors = [];

    // Check if all required fields are provided
    if (!name) errors.push("name");
    if (!price) errors.push("price");
    if (!company) errors.push("company");
    if (!category) errors.push("category");
    if (!color) errors.push("color");

    // Check if an image is provided
    if (!req.file) {
      errors.push("image");
    }

    // If any required fields are missing, return a 400 response with the missing fields
    if (errors.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${errors.join(", ")}`,
      });
    }

    // Convert the uploaded image to a base64 string format
    const base64String = `data:image/png;base64,${req.file.buffer.toString(
      "base64"
    )}`;

    // Create a new product document
    const product = new Products({
      userId,
      name,
      price,
      color,
      image: base64String,
      category,
      company,
    });

    // Save the product to the database
    await product.save();

    // Return a success response with the newly added product
    res.status(201).json({
      success: true,
      message: `${name} has been added successfully`,
      product: product,
    });
  } catch (error) {
    // Handle and log errors that occur during product creation
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all products created by the authenticated user
export const myProducts = async (req, res) => {
  try {
    // Get the authenticated user's data from the request object
    const { user } = req.user;
    const userId = user._id; // User ID of the authenticated user

    // Validate the user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "User not found" });
    }

    // Find products created by the authenticated user
    const product = await Products.find({ userId: userId });

    // Return the user's products in the response
    res.status(201).json({
      success: true,
      product: product,
    });
  } catch (error) {
    // Handle and log errors that occur while fetching the products
    console.error("Error fetching user products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a specific product created by the authenticated user
export const getMyProduct = async (req, res) => {
  try {
    const { productId } = req.params; // Get product ID from the URL parameters
    const { user } = req.user; // Get authenticated user data from request
    const userId = user._id; // Get user ID

    // Validate the user and product IDs
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    // Find the product by its ID
    const product = await Products.findOne({ _id: productId });

    // If the product doesn't exist, return a 404 response
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure that the product belongs to the authenticated user
    if (!product.userId.equals(userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this product" });
    }

    // Return the product details in the response
    res.status(200).json({
      success: true,
      product: product,
    });
  } catch (error) {
    // Handle and log any errors that occur
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a specific product created by the authenticated user
export const updateMyProducts = async (req, res) => {
  try {
    const { productId } = req.params; // Get product ID from URL parameters
    const { user } = req.user; // Get authenticated user data from request
    const userId = user._id; // Get user ID

    // Validate the user and product IDs
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    // Find the product by its ID
    const product = await Products.findOne({ _id: productId });

    // If the product doesn't exist, return a 404 response
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure that the product belongs to the authenticated user
    if (!product.userId.equals(userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this product" });
    }

    // Destructure the updated fields from the request body
    const { name, price, company, category, color } = req.body;

    // Validate that all required fields are provided
    let errors = [];
    if (!name) errors.push("name");
    if (!price) errors.push("price");
    if (!company) errors.push("company");
    if (!category) errors.push("category");
    if (!color) errors.push("color");

    let base64String = "";

    // If a new image is provided, convert it to a base64 string
    if (req.file) {
      base64String = `data:image/png;base64,${req.file.buffer.toString(
        "base64"
      )}`;
    }

    // If there are validation errors, return a 400 response
    if (errors.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${errors.join(", ")}`,
      });
    }

    // Update the product fields
    product.name = name;
    product.price = price;
    product.company = company;
    product.category = category;
    product.color = color;
    if (base64String) {
      product.image = base64String;
    }

    // Save the updated product
    await product.save();

    // Return a success response with the updated product details
    res.status(200).json({
      success: true,
      product: product,
      message: "Product updated successfully",
    });
  } catch (error) {
    // Handle and log any errors that occur
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a specific product created by the authenticated user
export const deleteMyProduct = async (req, res) => {
  try {
    const { productId } = req.params; // Get product ID from URL parameters
    const { user } = req.user; // Get authenticated user data from request
    const userId = user._id; // Get user ID

    // Validate the user and product IDs
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    // Find the product by its ID
    const product = await Products.findOne({ _id: productId });

    // If the product doesn't exist, return a 404 response
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure that the product belongs to the authenticated user
    if (!product.userId.equals(userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this product" });
    }

    // Delete the product
    await Products.deleteOne({ _id: productId });

    // Return a success response
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    // Handle and log any errors that occur
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
