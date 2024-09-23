import mongoose from "mongoose";
import Products from "../model/productModel";

export const products = async (req, res) => {
  try {

    const product = await Products.find();
    
    res.status(201).json({
      success: true,
      product : product
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export const addProduct = async (req, res) => {
  try {
    const { name , price , company, category , color} = req.body;

    const authHeader = req.headers.authorization;

    const userId = authHeader.split(' ')[1];

    // Initialize an array to collect error messages
    let errors = [];

    // Check each field and add an error message if a field is missing
    if (!name) errors.push("name");
    if (!price) errors.push("price");
    if (!company) errors.push("company");
    if (!category) errors.push("category");
    if (!color) errors.push("color")
      
    if (!req.file) {
      errors.push("image");
    }

    // If there are any errors, return a response with the missing fields
    if (errors.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${errors.join(", ")}`,
      });
    }

    const base64String = `data:image/png;base64,${req.file.buffer.toString('base64')}`; // Convert image to base64 string

    const product = new Products({
      userId,
      name,
      price,
      color,
      image:base64String,
      category,
      company
    })

    await product.save()

    res.status(201).json({
      success: true,
      message : `${name} has been added successfully`,
      product: product
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export const myProducts = async (req, res) => {
  try {

    const authHeader = req.headers.authorization;

    const userId = authHeader.split(' ')[1];

    // Step 1: Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "User not found" });
    }

    const product = await Products.find({ userId: userId });
    
    res.status(201).json({
      success: true,
      product : product
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export const getMyProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const authHeader = req.headers.authorization;

    // Extract the userId from the token
    const token = authHeader && authHeader.split(' ')[1]; // Assumes 'Bearer <token>' format
    const userId = token; // Assuming userId is directly from the token for simplicity (adjust if needed)

    // Step 1: Validate if the provided userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Step 2: Validate if the provided productId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    // Step 3: Find the product by its ID
    const product = await Products.findOne({ _id: productId });

    // Step 4: Check if product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Step 5: Check if the authenticated user's userId matches the product's userId
    if (!product.userId.equals(userId)) {
      return res.status(403).json({ message: "You are not authorized to access this product" });
    }


    // Step 6: Return the product if the user is authorized
    res.status(200).json({
      success: true,
      product: product
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateMyProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const authHeader = req.headers.authorization;

    // Extract the userId from the token
    const token = authHeader && authHeader.split(' ')[1]; // Assumes 'Bearer <token>' format
    const userId = token; // Assuming userId is directly from the token for simplicity (adjust if needed)

    // Step 1: Validate if the provided userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Step 2: Validate if the provided productId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    // Step 3: Find the product by its ID
    const product = await Products.findOne({ _id: productId });

    // Step 4: Check if product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Step 5: Check if the authenticated user's userId matches the product's userId
    if (!product.userId.equals(userId)) {
      return res.status(403).json({ message: "You are not authorized to access this product" });
    }

    const { name , price , company, category , color} = req.body;

    // Initialize an array to collect error messages
    let errors = [];

    // Check each field and add an error message if a field is missing
    if (!name) errors.push("name");
    if (!price) errors.push("price");
    if (!company) errors.push("company");
    if (!category) errors.push("category");
    if (!color) errors.push("color")
      
    let base64String = '';

    if (req.file) {
      base64String = `data:image/png;base64,${req.file.buffer.toString('base64')}`
    }

    // If there are any errors, return a response with the missing fields
    if (errors.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${errors.join(", ")}`,
      });
    }

    product.name = name;
    product.price = price;
    product.company = company;
    product.category = category;
    product.color = color;
    if (base64String) {
      product.image = base64String;
    }

    await product.save();

    res.status(200).json({
      success: true,
      product: product,
      message: "Product updated successfully",
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteMyProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const authHeader = req.headers.authorization;

    // Extract the userId from the token
    const token = authHeader && authHeader.split(' ')[1]; // Assumes 'Bearer <token>' format
    const userId = token; // Assuming userId is directly from the token for simplicity (adjust if needed)

    // Step 1: Validate if the provided userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Step 2: Validate if the provided productId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    // Step 3: Find the product by its ID
    const product = await Products.findOne({ _id: productId });

    // Step 4: Check if product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Step 5: Check if the authenticated user's userId matches the product's userId
    if (!product.userId.equals(userId)) {
      return res.status(403).json({ message: "You are not authorized to access this product" });
    }

    // Step 6: Delete the product
    await Products.deleteOne({ _id: productId });


    // Step 7: Return a success response
    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};