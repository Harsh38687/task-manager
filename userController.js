const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const { get } = require("mongoose");

//Create a new user
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

//Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send("Server error!!");
  }
};

module.exports = { createUser, getUsers };