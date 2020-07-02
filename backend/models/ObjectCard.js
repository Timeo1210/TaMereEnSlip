const mongoose = require('mongoose');

const objectCardSchema = new mongoose.Schema({
    card_id: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('ObjectCard', objectCardSchema);
