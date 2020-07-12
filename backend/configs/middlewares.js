const Player = require('../models/Player');
const Room = require('../models/Room');

const setHeaders = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, socketid, username, roomid");
    if (req.method === "OPTIONS") res.sendStatus(200);
    else {
        next();
    }
};

const authPlayer = async (req, res, next) => {
    const username = req.header('username');
    const socketId = req.header('socketid');
    if (username === undefined || socketId === undefined) res.sendStatus(400);
    else {
        const player = await Player.findOne({
            name: username,
            socketId,
        });
        if (!player) res.status(401).json({"msg": "player not found"});
        else {
            req.player = player;
            next();
        }
    }
};

const authAdminPlayer = async (req, res, next) => {
    const username = req.header('username');
    const socketId = req.header('socketid');
    const roomId = req.header('roomid') || req.params.id;
    if (username === undefined || socketId === undefined || roomId === undefined) res.sendStatus(400);
    else {
        const player = await Player.findOne({
            name: username,
            socketId,
        });
        if (!player) return res.status(401).json({"msg": "player not found"});

        const room = await Room.findById(roomId);
        if (room.admins.includes(player._id)) {
            req.player = player;
            req.room = room;
            next();
        } else {
            res.sendStatus(403);
        }
    }
};

/**
 * @description middleware that leave the player (params) from the room (params)
 * @async
 * @param {PlayerSchema} player
 * @param {RoomSchema} room
 * @returns Boolean
 */

const leavePlayerFromRoom = async (player, room) => {
    if (room === null || player === null) return false;
    const playerIndex = room.players.findIndex((elem) => elem.toString() === player._id.toString());
    if (playerIndex === -1) return false;
    room.players.splice(playerIndex, 1);
    await room.save();
    return true;
};

module.exports = {
    setHeaders,
    authPlayer,
    authAdminPlayer,
    leavePlayerFromRoom,
};
