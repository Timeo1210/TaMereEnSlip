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
        enum: ["standard", "iroquoise_hair", "african_women", "blondish_women", "chignon_glasses", "chignon_women", "hat_man", "hood_man", "mexican_beard_man", "redhead_man", "smoking_pipe_man"],
    },
    cardsCanBeSetBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
    },
});

module.exports = mongoose.model('Player', playerSchema);
