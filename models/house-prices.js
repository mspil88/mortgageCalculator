const mongoose = require("mongoose");

const PriceSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: [true],
    },
    date: {
        type: String,
        maxLength: 10
    },
    year: {
        type: Number,
    },
    postcode: {
        type: String,
        maxLength: 8,
    },
    property_type: {
        type: String,
    },
    outward_postcode: {
        type: String,
        maxLength: 4,
    },
    city: {
        type: String,
    },
    region: {
        type: String,
        required: [true],
    }
});

module.exports = mongoose.model("Price", PriceSchema);