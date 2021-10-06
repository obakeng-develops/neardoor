const mongoose = require("mongoose");

const tipSchema = new mongoose.Schema({
    tipAmount: {
        type: mongoose.Types.Decimal128
    },
    courierId: {
        type: String
    }
});

module.exports = mongoose.model('Tip', tipSchema);