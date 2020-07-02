const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    turn: {
        type: Number,
        default: 0,
    },
    name: {
        type: String,
        required: true,
    },
    isJoinable: {
        type: Boolean,
        default: true,
    },
    isCustomCard: {
        type: Boolean,
        default: false,
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
    }],
    admins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
        },
    ],
    maxPlayer: {
        type: Number,
        default: 4,
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Room', roomSchema);
