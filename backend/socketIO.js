const Player = require('./models/Player');
const Room = require('./models/Room');
const middlewares = require('./configs/middlewares');

async function authPlayer(playerInfo) {
    const player = await Player.findById(playerInfo._id);
    if (!player) return false;
    return player;
}

function ioMiddleware(io) {
    io.on('connection', (socket) => {
        console.log('NEW Client');

        socket.on('/rooms/join', async (playerInfo, roomId) => {
            const player = await authPlayer(playerInfo);
            if (player) {
                await socket.join(`${roomId}`);
                io.in(`${roomId}`).emit('GET:/room');
            }
        });

        socket.on('TOROOM::TIMER:RESUME', (data) => {
            const socketRooms = Object.keys(socket.rooms);
            const socketRoom = socketRooms.filter((elem) => elem !== socket.id)[0];
            io.in(socketRoom).emit('TIMER:RESUME', data);
        })

        socket.on('TOROOM::TIMER:PAUSE', (data) => {
            const socketRooms = Object.keys(socket.rooms);
            const socketRoom = socketRooms.filter((elem) => elem !== socket.id)[0];
            io.in(socketRoom).emit('TIMER:PAUSE', data);
        })

        socket.on('disconnecting', async () => {
            const socketRooms = Object.keys(socket.rooms);
            const socketRoom = socketRooms.filter((elem) => elem !== socket.id)[0];
            if (socketRoom !== undefined) {
                const room = await Room.findById(socketRoom);
                const player = await Player.findOne({
                    socketId: socket.id,
                });
                const middlewareStatus = await middlewares.leavePlayerFromRoom(player, room);
                if (middlewareStatus) {
                    if (room.players.length === 0) await room.remove();
                    else io.in(`${socketRoom}`).emit('GET:/room');
                }
            }
            // const room = await Room.findById(socketRooms[0]);
            // console.log(room)
        });

        socket.on('disconnect', async () => {
            console.log('DISCONNECT from Client');
        });
    });
}

module.exports = ioMiddleware;
