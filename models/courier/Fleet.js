const mongoose = require("mongoose");

const fleetSchema = new mongoose.Schema({
    fleetName: {
        type: String
    },
    vehicles: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('Fleet', fleetSchema);