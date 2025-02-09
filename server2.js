require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs"); 

// Initialize Express App
const app = express();
const port = 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ limit: "10mb" })); // Increase limit for large image data

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Register User Route
app.post("/register", async (req, res) => {
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
app.post("/upload-image", async (req, res) => {
  try {
    const { token, imageData } = req.body;
    console.log("Received Token:", token);

    const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, ""); // Remove the base64 prefix

    // Generate a random filename (you can improve this logic)
    const filename = `${Date.now()}.jpg`;

    // Save the image to the 'images' directory
    const imagePath = `images/${filename}`;
    fs.writeFileSync(imagePath, base64Data, "base64");

    // Verify token
    const decoded = jwt.verify(token, "your_jwt_secret");
    const userId = decoded.userId;

    // Find user and update image
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    user.image = imageData;
    await user.save();

    res.json({ success: true, message: "Image captured and saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error uploading image", error });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
