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
        maxlength: 30
    },
    isCustom: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Card', cardSchema);
