const express = require('express');
const Player = require('../models/Player');
const customMiddlewares = require('../configs/middlewares');
const router = express.Router();

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

    res.sendStatus(500);
});

module.exports = router;
