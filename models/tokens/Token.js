const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    }
});

module.exports = mongoose.model('Token', tokenSchema);