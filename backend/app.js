if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');

const customMiddlewares = require('./configs/middlewares');
const ioMiddleware = require('./socketIO');

const rootRouter = require('./routes/root');
const cardRouter = require('./routes/card');
const roomRouter = require('./routes/room');
const usersRouter = require('./routes/users');

app.use(express.urlencoded({extended: true}));
app.use(customMiddlewares.setHeaders);

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

const server = http.createServer(app);

const io = socketIo(server);
app.use((req, res, next) => {
    req.socketio = io;
    next();
});
ioMiddleware(io);

app.use('/', rootRouter);
app.use('/cards', cardRouter);
app.use('/rooms', roomRouter);
app.use('/users', usersRouter);

server.listen(process.env.PORT || 4000);
