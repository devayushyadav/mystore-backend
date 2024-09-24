import Jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  // Check if the 'Authorization' header is present
  const authHeader = req.headers.authorization;

  // If no Authorization header is found, send a 401 Unauthorized response
  if (!authHeader) {
    return res.status(401).json({
      error: "Authorization token is missing",
      message: "You are not authorized, Redirecting to login",
    });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  // Verify the token and extract the payload (user data)
  Jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({
        error: "Invalid token",
        message: "You are not authorized, Redirecting to login",
      });
    }

    // Attach the extracted user data to the request object
    req.user = decodedToken;

    // Proceed to the next middleware or route handler
    next();
  });
};
