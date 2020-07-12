const express = require('express');
const customMiddlewares = require('../configs/middlewares');
const router = express.Router();

const Player = require('../models/Player');
const Room = require('../models/Room');
const middlewares = require('../configs/middlewares');

router.get('/', async (req, res) => {
    // console.log(req.headers);
    const rooms = (await Room.find().lean()).sort((a, b) => {
        const nA = a.isJoinable === true ? -1 : 1;
        const nB = b.isJoinable === true ? -1 : 1;
        return nA + nB;
    });
    if (req.query.withPlayersKey === 'imageProfil') {
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].players.length !== 0) {
                const newPlayers = await Promise.all(rooms[i].players.map(async (elem) => {
                    const player = await Player.findById(elem);
                    const { imageProfil } = player;
                    return {imageProfil};
                }));
                rooms[i].players = newPlayers;
            }
        }
    }
    res.json({
        "rooms": JSON.stringify(rooms),
    });
});

router.get('/:id', customMiddlewares.authPlayer, async (req, res) => {
    const room = await Room.findById(req.params.id);
    const { player } = req;
    if (room === null || player === null) return res.sendStatus(401);
    res.status(200).json(room);
});

router.post('/', customMiddlewares.authPlayer, async (req, res) => {
    // set max_pplayer
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
        const { player } = req;
        if (room === null || player === null) return res.sendStatus(401);
        // if player alone set him admin
        if (room.players.length === 0) {
            if (!room.admins.includes(player._id)) room.admins.push(player);
        }
        if (room.players.includes(player._id)
        || room.players.length + 1 > room.maxPlayer
        // || !room.isJoinable)
        ) return res.sendStatus(201);
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

router.delete('/:id/leave', customMiddlewares.authPlayer, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        const { player } = req;
        const middlewareStatus = await middlewares.leavePlayerFromRoom(player, room);
        if (!middlewareStatus) return res.sendStatus(401);
        req.socketio.in(`${room.id}`).emit('GET:/room');
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.put('/:id/kick/users/:userId', customMiddlewares.authAdminPlayer, async (req, res) => {
    try {
        const kickPlayer = await Player.findById(req.params.userId);
        const middlewareStatus = await middlewares.leavePlayerFromRoom(kickPlayer, req.room);
        if (!middlewareStatus) return res.sendStatus(401);
        req.socketio.in(`${req.room.id}`).emit('GET:/room');
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.put('/:id/start', customMiddlewares.authAdminPlayer, async (req, res) => {
    try {
        console.log(req.room);
        if (!req.room.isGameHasStart
        //  && req.room.players.length > 1
            && 1 + 1 === 2
        ) {
            req.room.isJoinable = false;
            await req.room.save();
            if (req.room.isCustomCard) {
                await req.room.players.forEach(async (elem, index) => {
                    const player = await Player.findById(elem);
                    const nextIndex = index + 1 >= req.room.players.length ? 0 : index + 1;
                    player.cardsCanBeSetBy = await Player.findById(req.room.players[nextIndex]);
                    await player.save();
                    console.log(player);
                });
            } else {
                console.log("WTF");
            }
        } else {
            res.sendStatus(401);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.delete('/:id', customMiddlewares.authPlayer, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        const { player } = req;
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

router.patch('/:id', middlewares.authAdminPlayer, async (req, res) => {
    try {
        Object.assign(req.room, req.query);
        await req.room.save();
        req.socketio.to(`${req.room._id}`).emit('GET:/room');

        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;
