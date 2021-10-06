const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
    storeName: {
        type: String,
        default: "",
        required: true
    },
    operatingHours: {
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date,
            required: true
        }
    },
    storeLogo: {
        type: String,
        default: ""
    },
    storeCoverImage: {
        type: String,
        default: ""
    },
    hasOrdersPaused: {
        type: Boolean,
        default: false
    },
    storeType: {
        type: Array,
        default: []
    },
    isStoreOnboarded: {
        type: Boolean,
        default: false
    },
    OffboardedOn: {
        type: Date
    },
    storeRating: {
        type: Number,
        default: 0
    },
    managedBy: {
        type: String
    },
    menus: {
        type: Array,
        default: [] 
    },
    storeAddress: {
        type: Array,
        default: []
    },
    storeCategory: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model("Store", storeSchema);