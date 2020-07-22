const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ["people", "object"],
    },
    content: {
        type: String,
        required: true,
    },
    isCustom: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Card', cardSchema);
