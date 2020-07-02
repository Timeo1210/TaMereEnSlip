const express = require('express');
const customMiddlewares = require('../configs/middlewares');
const router = express.Router();

const Player = require('../models/Player');
const Room = require('../models/Room');
const { route } = require('./root');
/*
router.post('/', async (req, res) => {
    const player = new Player({
        name: "timeo1210",
    });
    try {
        const newPlayer = await player.save();
        console.log(newPlayer);
    } catch (e) {
        res.sendStatus(500);
    }

    const room = new Room({
        name: "HelloWorld",
    });
    try {
        const newRoom = await room.save()
        console.log(newRoom);
        res.json({
            "msg": "created",
        });
    } catch (e) {
        res.sendStatus(500);
    }
});
*/
/*
router.put('/test', async (req, res) => {
    let player;
    let room;
    try {
        player = await Player.findById("5ef6bc1c97c12246f9b9e6cf");
        room = await Room.findById("5ef6bc9fdf9c5547283588f9");
        console.log(room);
        room.Players = [player];
        await room.save();
        res.json({
            "msg": "succed",
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
*/

router.get('/', async (req, res) => {
    // console.log(req.headers);
    const rooms = (await Room.find()).sort((a, b) => {
        const nA = a.isJoinable === true ? -1 : 1;
        const nB = b.isJoinable === true ? -1 : 1;
        return nA + nB;
    });
    res.json({
        "data": JSON.stringify(rooms),
    });
});

router.post('/', customMiddlewares.authPlayer, async (req, res) => {
    const room = new Room({
        name: req.query.name,
    });
    try {
        const newRoom = await room.save();
        res.json({
            "msg": "succed",
            "room_id": newRoom._id,
        });
    } catch (e) {
        res.sendStatus(500);
    }
});

router.post('/test', async (req, res) => {
    const player = new Player({
        name: req.query.name,
        socketId: req.query.socketId,
    });
    await player.save();
    res.sendStatus(200);
});

router.put('/:id/join', customMiddlewares.authPlayer, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        const player = await Player.findOne({
            socketId: req.query.socketId,
        });
        if (room === null || player === null) return res.sendStatus(401);
        // if player alone set him admin
        if (room.players.length === 0) {
            if (!room.admins.includes(player._id)) room.admins.push(player);
        }
        if (room.players.includes(player._id)) return res.sendStatus(201);
        room.players.push(player);
        await room.save();

        // set player turn
        player.turn = room.players.findIndex((elem) => elem._id === player._id);
        await player.save();

        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.put('/:id/leave', customMiddlewares.authPlayer, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        const player = await Player.findOne({
            socketId: req.query.socketId,
        });
        if (room === null || player === null) return res.sendStatus(401);
        const playerIndex = room.players.findIndex((elem) => elem._id === player._id);
        room.players.splice(playerIndex, 1);
        await room.save();

        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.delete('/:id', customMiddlewares.authPlayer, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        const player = await Player.findOne({
            socketId: req.query.socketId,
        });
        if (room === null || player === null) return res.sendStatus(401);
        if (room.admins.includes(player._id)) {
            await room.remove();
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;
