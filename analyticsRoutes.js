const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware.js");
const { getTaskAnalytics } = require("../controllers/analyticsController.js");

router.get("/", authenticateToken, getTaskAnalytics);

module.exports = router;