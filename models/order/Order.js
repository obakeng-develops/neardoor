const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        minlength: 6,
    },
    orderTotal: {
        type: mongoose.Types.Decimal128,
    },
    isDeliveryOrder: {
        type: Boolean,
        default: true
    },
    isScheduledOrder: {
        type: Boolean,
        default: false
    },
    orderCompletionTime: {
        type: Date,
    },
    orderInstructions: {
        type: String
    },
    orderItems: {
        type: Array
    },
    orderedBy: {
        userId: {
            type: String
        },
        storeId: {
            type: String
        }
    },
    orderStatus: {
        type: String,
        default: "incoming",
        enum: ['incoming', 'outgoing', 'ready', 'cancelled']
    },
    isOrderAccepted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Order', orderSchema);