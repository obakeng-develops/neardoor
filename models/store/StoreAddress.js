const mongoose = require("mongoose");

const storeAddressSchema = new mongoose.Schema({
    streetAddress: {
        type: String,
        default: true,
        required: true
    },
    surburb: {
        type: String,
        default: "",
        required: true
    },
    city: {
        type: String,
        default: "",
        required: true
    },
    longitude: {
        type: String,
        default: "",
        required: true
    },
    latitude: {
        type: String,
        default: "",
        required: true
    },
    country: {
        type: String,
        default: "",
        required: true
    },
    zipCode: {
        type: String,
        default: "",
        required: true
    }
});

module.exports = mongoose.model('StoreAddress', storeAddressSchema);