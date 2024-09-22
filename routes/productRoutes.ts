// This line imports the multer library, which is a middleware for handling multipart/form-data in Node.js applications. 
// It’s commonly used for handling file uploads.
import multer from 'multer';

import { addProduct, myProducts } from "../controller/productController";
import { authMiddleware } from "../middleware/authMiddleware";

const express = require("express");

// This line initializes a storage engine provided by multer.
// memoryStorage means that the uploaded files will be stored in memory as a Buffer (temporary storage). 
// This is useful for small files and allows you to manipulate the file data in your application without writing it to disk first
const storage = multer.memoryStorage();
// This line creates an instance of the multer middleware with the specified storage configuration.
const upload = multer({ storage: storage });

const productRoutes = express.Router();

productRoutes.use(authMiddleware)

// upload.single('image')
// The method .single('image') tells multer that you expect a single file upload with the field name image
productRoutes.post("/add-product",upload.single('image'), addProduct);
productRoutes.get("/my-products/:userId", myProducts);



export default productRoutes