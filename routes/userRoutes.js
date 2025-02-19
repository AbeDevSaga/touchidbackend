const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../mailer");
const RegistrationLink = require("../models/RegistrationLink");

const router = express.Router();

router.post("/register/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { name, email, phone } = req.body;

    // Verify JWT token and check expiration
    let decoded;
    try {
      decoded = jwt.verify(token, "your_jwt_secret");
    } catch (err) {
      return res
        .status(403)
        .json({ message: "Invalid or expired registration link" });
    }

    // Check if the token exists, is not expired, and is not used
    const link = await RegistrationLink.findOne({ token });

    if (!link || link.expiresAt < new Date() || link.used) {
      return res
        .status(403)
        .json({ message: "Invalid or expired registration link" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Create new user
    const newUser = new User({ name, email, phone });
    await newUser.save();

    // Mark the link as used and remove it
    await RegistrationLink.deleteOne({ token });

    // Generate JWT token
    const user_token = jwt.sign({ userId: newUser._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    // Send welcome email after registration
    if (email) {
      const subject = "Welcome to Our Platform!";
      const text = `Hello ${name},\n\nThank you for registering with us. We are excited to have you on board. Your registration was successful!`;
      await sendEmail(email, subject, text);
    }

    res.json({ message: "User registered successfully", token: user_token });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// Save Image Data Route
router.post("/upload-image", async (req, res) => {
  try {
    const { token, imageData } = req.body;

    // Verify token
    const decoded = jwt.verify(token, "your_jwt_secret");
    const userId = decoded.userId;

    // Find user and update image
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.image = imageData;
    await user.save();

    res.json({
      success: true,
      message: "Image captured and saved successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error uploading image", error });
  }
});

module.exports = router;
