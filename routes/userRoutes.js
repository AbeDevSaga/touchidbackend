const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Create new user
    const newUser = new User({ name, email, phone });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    res.json({ message: "User registered successfully", token });
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

    res.json({ success: true, message: "Image captured and saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error uploading image", error });
  }
});


module.exports = router;