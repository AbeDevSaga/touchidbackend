const Admin = require("../models/Admin");
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    // Check if the admin already exists
    const adminExists = await Admin.findOne({ email: "biometricinformation060@gmail.com" });
    if (adminExists) {
      console.log("Admin already exists in the database.");
      return;
    }

    const hashedPassword = await bcrypt.hash("bio@metric", 10);

    // Create new admin user if not exists
    const admin = new Admin({
      name: "admin",
      email: "biometricinformation060@gmail.com",
      password: hashedPassword, 
    });

    // Save the admin to the database
    await admin.save();
    console.log("Admin seeded to the database!");
  } catch (err) {
    console.error("Error seeding admin:", err);
  }
};

module.exports = seedAdmin;
