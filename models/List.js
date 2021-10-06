const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    restaurants: {
        type: Array
    }
});

module.exports = mongoose.model('List', listSchema);