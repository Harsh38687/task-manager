const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("Email not found!!");
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).send("Invalid password!!");
  const token = jwt.sign(
    { _id: user._id, role: user.role }, // Payload: Data encoded in the JWT
    process.env.JWT_SECRET, // Secret key: Used to sign the token
    { expiresIn: "1h" } // Options: Token expiration time
  );
  res.header("Authorization", token).send({ token });
  // Storing the token in headers is a common practice in APIs. It allows clients (like frontends) to easily include the token in future requests via the Authorization header for authentication.
};

module.exports = { login };
