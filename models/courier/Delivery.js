const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
    orderId: {
        type: String
    },
    deliveryAddress: {
        type: String
    },
    deliveryTime: {
        deliveryStartTime: {
            type: Date
        },
        deliveryEndTime: {
            type: Date
        }
    },
    courierId: {
        type: String
    },
    deliveryStatus: {
        type: String,
        default: "at store",
        enum: ["at store", "collected", "delivered", "cancelled"]
    }
});

module.exports = mongoose.model('Delivery', deliverySchema);