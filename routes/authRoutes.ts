import { login, signup } from "../controller/authController";

const express = require("express");

const authRoutes = express.Router();

authRoutes.post("/login", login);
authRoutes.post("/signup", signup);


export default authRoutes