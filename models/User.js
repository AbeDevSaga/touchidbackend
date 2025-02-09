const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    image: String, // To store image data
});

module.exports = mongoose.model('User', userSchema);
