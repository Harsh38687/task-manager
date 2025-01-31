const express = require("express");
const router = express.Router();
const { enable2FA, verify2FA } = require("../controllers/authController2.js");
const authenticateToken = require("../middleware/authMiddleware.js");

router.post("/enable-2fa", authenticateToken, enable2FA);
router.post("/verify-2fa", authenticateToken, verify2FA);

module.exports = router;
