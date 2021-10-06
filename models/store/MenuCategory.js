const mongoose = require("mongoose");

const menuCategorySchema = new mongoose.Schema({
    menuCategoryName: {
        type: String
    },
    menuCategoryDescription: {
        type: String
    },
    menuId: {
        type: String
    },
    menuItems: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('MenuCategory', menuCategorySchema);