const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: { type: String, unique: true },
  countryName: String,
  image: String,
  deviceInfo: {
    userAgent: String,
    screenResolution: String,
    timezone: String,
    language: String,
    deviceMemory: String,
    hardwareConcurrency: String,
    location: {
      latitude: Number,
      longitude: Number,
    },
  },
});

module.exports = mongoose.model("User", userSchema);
