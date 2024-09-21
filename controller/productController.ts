import Products from "../model/productModel";
import User from "../model/usersModel";


export const addProduct = async (req, res) => {
  try {
    const { name , price , company, category , color, image} = req.body;
    const userId = req.headers.authorization

    // Initialize an array to collect error messages
    let errors = [];

    // Check each field and add an error message if a field is missing
    if (!name) errors.push("name");
    if (!price) errors.push("price");
    if (!company) errors.push("company");
    if (!category) errors.push("category");
    if (!color) errors.push("color")
    if (!image) errors.push("image")

    // If there are any errors, return a response with the missing fields
    if (errors.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${errors.join(", ")}`,
      });
    }

    const product = new Products({
      userId,
      name,
      price,
      color,
      image,
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