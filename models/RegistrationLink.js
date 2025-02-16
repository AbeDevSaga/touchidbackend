const mongoose = require("mongoose");

const RegistrationLinkSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }
});

module.exports = mongoose.model("RegistrationLink", RegistrationLinkSchema);
