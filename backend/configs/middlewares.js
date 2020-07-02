const Player = require('../models/Player');

const setHeaders = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, socketid, username");
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

module.exports = {
    setHeaders,
    authPlayer,
};
