import { addProduct } from "../controller/productController";
import { authMiddleware } from "../middleware/authMiddleware";

const express = require("express");

const productRoutes = express.Router();

productRoutes.use(authMiddleware)

productRoutes.post("/add-product", addProduct);
// authRoutes.post("/signup", signup);


export default productRoutes