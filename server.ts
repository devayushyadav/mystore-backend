import connectDB from "./lib/db";
import express from "express";
import authRoutes from "./routes/authRoutes";
import cors from "cors";

const app = express();

// Set a default port if process.env.PORT is undefined
const port = process.env.PORT || 4500;

// Connect to MongoDB when the server starts
connectDB()
  .then(() => console.log("MongoDB connection initialized"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Middleware to parse JSON (if you're sending JSON data)
app.use(express.json());
app.use(cors());

// Define a simple route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

// Use the routes defined in `routes.js`
app.use("/api", authRoutes);
// app.use("/", privateRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
