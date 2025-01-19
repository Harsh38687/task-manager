const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, reuired: true },
  role: {
    type: String,
    enum: ["admin", "manager", "employee"],
    default: "employee",
  },
});

module.exports = mongoose.model("User", UserSchema);
