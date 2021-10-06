const mongoose = require("mongoose");

const courierSchema = new mongoose.Schema({
    idNumber: {
        type: String,
        minlength: 13
    },
    driversLicense: {
        type: String,
        default: ""
    },
    proofOfAddress: {
        type: String,
        default: ""
    },
    isOnDuty: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    ratings: {
        type: Number,
    },
    fleet: {
        type: Array
    }
});

module.exports = mongoose.model('Courier', courierSchema);