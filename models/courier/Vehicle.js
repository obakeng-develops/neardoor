const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    vehicleManufacturer: {
        type: String,
        required: true
    },
    vehicleYear: {
        type: String,
        required: true
    },
    vehicleModel: {
        type: String,
        required: true
    },
    vehicleNumberPlate: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);