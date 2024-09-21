export const authMiddleware = (req, res, next) => {

  // Check if the 'Authorization' header is present
  const authHeader = req.headers.authorization;

  // If no Authorization header is found, send a 401 Unauthorized response
  if (!authHeader) {
    return res.status(401).json({
      error: "Authorization token is missing",
      message :"You are not authorized, Redirecting to login"
    });
  }

  // If token is present, you can perform additional validation here if needed
  // For example, verifying the token if it's a JWT or checking the format

  next(); // Proceed to the next middleware or route handler
};