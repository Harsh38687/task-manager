const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const generateSecret = () => {
  return speakeasy.generateSecret({ length: 20 });
};

const generateQRCode = async (secret) => {
  return await QRCode.toDataURL(secret.otpauth_url);
};

//  Time-based One-Time Passwords (TOTP)
const verifyToken = (token, secret) => {
  return speakeasy.totp.verify({
    secret: secret.base32,
    encoding: "base32",
    token,
  });
};

module.exports = { generateSecret, generateQRCode, verifyToken };