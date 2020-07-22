const mongoose = require('mongoose');

const peopleCardSchema = new mongoose.Schema({
    card_id: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('PeopleCard', peopleCardSchema);
