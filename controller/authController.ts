import {
  generateAccessToken,
  generateHashedPassword,
  matchPassword,
} from "../lib/config";
import User from "../model/usersModel";
import Jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Initialize an array to collect error messages
    let errors = [];

    // Check each field and add an error message if a field is missing
    if (!email) errors.push("email");
    if (!password) errors.push("password");

    // If there are any errors, return a response with the missing fields
    if (errors.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${errors.join(", ")}`,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist." });
    }

    const isPasswordCorrect = await matchPassword(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(404)
        .json({ message: "Invalid password, Please try again" });
    }

    const accessToken = await generateAccessToken(user);

    res.status(201).json({
      success: true,
      message: `Welcome ${user.firstName}`,
      user: user,
      token: accessToken,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;

    // Initialize an array to collect error messages
    let errors = [];

    // Check each field and add an error message if a field is missing
    if (!firstName) errors.push("firstName");
    if (!lastName) errors.push("lastName");
    if (!email) errors.push("email");
    if (!mobile) errors.push("mobile");
    if (!password) errors.push("password");

    // If there are any errors, return a response with the missing fields
    if (errors.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${errors.join(", ")}`,
      });
    }

    const hashedPassword = await generateHashedPassword(password);

    const user = new User({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: `Congratulation ${firstName}, your account has been created successfully. Please login to continue`,
      user: user,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
