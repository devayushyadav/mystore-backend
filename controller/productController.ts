import mongoose from "mongoose";
import Products from "../model/productModel";


export const addProduct = async (req, res) => {
  try {
    const { name , price , company, category , color , userId} = req.body;

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
    const userId = req.params.userId;

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