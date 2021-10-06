const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Types.ObjectId
    },
    orderItemQuantity: {
        type: Number
    },
    extraNote: {
        type: String,
        maxlength: 140
    }
});

module.exports = mongoose.model('OrderItem', orderItemSchema);