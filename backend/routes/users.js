const express = require('express');
const Player = require('../models/Player');
const Card = require('../models/Card');
const Room = require('../models/Room');
const customMiddlewares = require('../configs/middlewares');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id).lean();
        await delete player.socketId;
        if (player) return res.status(200).json(player);
        return res.sendStatus(404);
    } catch (e) {
        console.log(e);
    }
});

router.post('/login', customMiddlewares.authPlayer, async (req, res) => {
    const { newSocketId } = req.query;
    if (!newSocketId) return res.sendStatus(400);
    try {
        req.player.socketId = newSocketId;
        const newPlayer = await req.player.save();
        res.status(200).json(newPlayer);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/new', async (req, res) => {
    const { username, socketId, imageProfil } = req.query;
    try {
        if (username === undefined || socketId === undefined || imageProfil === undefined) res.sendStatus(400);
        const existingPlayer = await Player.find({
            name: username,
        });
        if (existingPlayer.length > 0) return res.status(409).json({"msg": "user already exist"});
        const player = new Player({
            name: username,
            socketId,
            imageProfil,
        });
        const newPlayer = await player.save();
        res.status(200).json(newPlayer);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.put('/:id/customCards', customMiddlewares.authPlayer, async (req, res) => {
    const {
        peopleCardText,
        objectCardText,
        roomid
    } = req.query;
    const playerId = req.params.id;
    //auth
    try {
        const playerSetted = await Player.findById(playerId);
        if (!playerSetted) return res.sendStatus(404);
        if (!req.player._id.equals(playerSetted.cardsCanBeSetBy)) return res.sendStatus(403);
        //create cards
        const peopleCard = new Card({
            type: "people",
            content: peopleCardText,
            isCustom: true
        });
        const objectCard = new Card({
            type: "object",
            content: objectCardText,
            isCustom: true
        });
        const newPeopleCard = await peopleCard.save();
        const newObjectCard = await objectCard.save();
        //set cards
        playerSetted.cards = [newPeopleCard, newObjectCard];
        await playerSetted.save();
        //update room
        const room = await Room.findById(roomid);
        room.cardsCanBeSetBy = room.cardsCanBeSetBy.filter((elem) => !req.player._id.equals(elem[0]));
        await room.save();
        req.socketio.to(req.player.socketId).emit('GET:/room');
        if (room.cardsCanBeSetBy.length === 0) {
            room.isGameHasStart = true;
            room.timerTime = 30;
            await room.save();
            req.socketio.to(room.id).emit('GET:/room');
        }
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }

});

module.exports = router;
