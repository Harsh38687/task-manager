const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied!!");
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // token: The JWT obtained from the Authorization header, process.env.JWT_SECRET: The secret key used to sign the token during its creation.
    // If the token is valid, jwt.verify() decodes it and returns the payload (e.g., user information such as id and role
    req.user = verified; // Attach the verified payload to the request object
    // The decoded token (payload) is attached to req.user, making the user's information available to subsequent middleware or route handlers.
    //  By attaching the decoded token (req.user) to the request, subsequent middleware or handlers can make decisions (e.g., role-based access control) based on the user’s information
    next(); // Pass control to the next middleware or route handler
  } catch (err) {
    res.status(400).send("Invalid Token!!");
  }
};

module.exports = authenticateToken;