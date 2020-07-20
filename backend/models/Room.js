const mongoose = require('mongoose');
const Player = require('./Player');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    roomImageProfil: {
        type: String,
        default: "standard",
        enum: ["standard", "iroquoise_hair"],
    },
    turn: {
        type: Number,
        default: 0,
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
    timerStartTime: {
        type: Number,
        default: 30
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
    isGameHasStart: {
        type: Boolean,
        default: false,
    },
    cardsCanBeSetBy: [
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player',
            }
        ]
    ],
}, {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
});

module.exports = mongoose.model('Room', roomSchema);
