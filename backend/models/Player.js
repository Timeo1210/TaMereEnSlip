const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    turn: {
        type: Number,
    },
    cards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Card',
        },
    ],
    socketId: {
        type: String,
        required: true,
    },
    imageProfil: {
        type: String,
        required: true,
        enum: ["standard", "iroquoise_hair"],
    },
});

module.exports = mongoose.model('Player', playerSchema);
