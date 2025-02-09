const express = require("express");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// Admin Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id, role: "admin" }, "admin_secret", { expiresIn: "2h" });

    res.json({ success: true, message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ success: true, message: "Error logging in", error });
  }
});

// Get Admin Profile (Protected)
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "admin_secret");

    const admin = await Admin.findById(decoded.adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json(admin);
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete User (Admin Only)
router.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get User by ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
