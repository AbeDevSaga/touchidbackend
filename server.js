require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const seedAdmin = require("./admin/seedAdmin"); 

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

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
  .then(() => {
    console.log("MongoDB Connected");
    seedAdmin();
  })
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
