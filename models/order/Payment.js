const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    amount: {
        type: mongoose.Types.Decimal128,
    },
    paymentDate: {
        type: Date,
        default: Date.now()
    },
    paymentMethod: {
        type: Array,
        default: []
    },
    orderId: {
        type: String
    }
});

module.exports = mongoose.model('Payment', paymentSchema);