const mongoose = require("mongoose");

const foodCategorySchema = new mongoose.Schema({
    foodCategoryName: {
        type: Array,
        default: ['Burgers', 'American', 'African', 'Chinese', 'Home-cooked', 'Pizza', 'Chicken', 'Wings']
    },
    foodCategoryDescription: {
        type: String
    }
});

module.exports = mongoose.model('FoodCategory', foodCategorySchema);