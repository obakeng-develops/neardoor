const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
    discountType: {
        type: String,
        enum: ['fixed', 'percentage', 'none']
    },
    discountPeriod: {
        discountStartDate: {
            type: Date
        },
        discountEndDate: {
            type: Date
        }
    }
});

module.exports = mongoose.model('Discount', discountSchema);