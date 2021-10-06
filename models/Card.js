const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    cardHolder: {
        type: String
    },
    cardNumber: {
        type: Number,
    },
    expiryDate: {
        type: Date
    },
    cvv: {
        type: Number
    },
    userId: {
        type: String
    }
});

module.exports = mongoose.model('Card', cardSchema);