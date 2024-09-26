import Jwt from "jsonwebtoken";

export const isBase64 = (str) => {
  try {
    // Remove the data URL prefix if present
    const base64String = str.split(",")[1] || str;
    return (
      Buffer.from(base64String, "base64").toString("base64") === base64String
    );
  } catch (error) {
    return false;
  }
};

export const generateAccessToken = (user) => {
  const token = Jwt.sign({ user }, process.env.JWT_KEY, {
    expiresIn: "1h",
  });
  return token;
};
