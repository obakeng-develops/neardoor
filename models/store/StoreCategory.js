const mongoose = require("mongoose");

const storeCategorySchema = new mongoose.Schema({
    storeCategoryName: {
        type: String,
        default: ""
    },
    storeCategoryDescription: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('StoreCategory', storeCategorySchema);