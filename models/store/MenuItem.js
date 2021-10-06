const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
    menuItemName: {
        type: String,
        required: true
    },
    menuItemPrice: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    menuItemDescription: {
        type: String,
        minLength: 10,
        default: ""
    },
    menuItemImage: {
        type: String,
        default: ""
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    foodCategory: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);