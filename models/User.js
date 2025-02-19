const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: { type: String, unique: true },
    image: String,
});

module.exports = mongoose.model('User', userSchema);
