const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: { type: String, unique: true },
    countryName: String,
    image: String,
});

module.exports = mongoose.model('User', userSchema);
