const mongoose = require("mongoose");

const scheduledOrderSchema = new mongoose.Schema({
    orderId: {
        type: String
    },
    scheduledTime: {
        type: Date
    }
});

module.exports = mongoose.model('scheduledOrder', scheduledOrderSchema);