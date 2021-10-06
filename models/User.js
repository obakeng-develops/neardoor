const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
        default: ""
    },
    lastName: {
        type: String,
        required: false,
        default: ""
    },
    email: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 80,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['consumer', 'merchant', 'courier', 'admin'],
        default: 'consumer'
    },
    profilePhoto: {
        type: String,
        default: ""
    },
    cellNumber: {
        type: String,
        default: ""
    },
    isOnboarded: {
        type: Boolean,
        default: false
    },
    favouriteStores: {
        type: Array,
        default: []
    }
});

userSchema.methods.verifyPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
};

module.exports = mongoose.model("User", userSchema);