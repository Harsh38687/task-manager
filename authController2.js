const {
  generateSecret,
  generateQRCode,
  verifyToken,
} = require("../utils/otpService.js");

let userSecrets = {}; // Temporary store; replace with DB for persistence

exports.enable2FA = async (req, res) => {
  const secret = generateSecret();
  const qrcode = await generateQRCode(secret);
  userSecrets[req.user._id] = secret;
  res.json({ qrcode });
};

exports.verify2FA = (req, res) => {
  const { token } = req.body;
  const secret = userSecrets[req.user._id];
  if (!secret) {
    return res.status(400).send("2FA not enabled!");
  }
  const isValid = verifyToken(token, secret);
  if (isValid) {
    res.send("2FA verified!");
  } else {
    res.status(400).send("Invalid 2FA token!");
  }
};
