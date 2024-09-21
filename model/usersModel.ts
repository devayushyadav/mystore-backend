const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

// Correct the model caching logic to avoid re-registering the model
const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;