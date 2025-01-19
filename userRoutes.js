const express = require("express");
const { login } = require("../controllers/authController.js");
const { createUser, getUsers } = require("../controllers/userController.js");
const authorizeRole = require("../middleware/roleMiddleware.js");
const authenticateToken = require("../middleware/authMiddleware.js");

const router = express.Router();

//User routes
router.post("/register", createUser);
router.post("/login", login);
router.get("/", authenticateToken, authorizeRole(["admin"]), getUsers);

module.exports = router;
