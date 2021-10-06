const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    menuName: {
        type: String,
        required: true,
        minLength: 4
    },
    menuTime: {
        menuStartTime: {
            type: Date,
            required: true
        },
        menuEndTime: {
            type: Date,
            required: true
        }
    },
    menuItems: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('Menu', menuSchema);