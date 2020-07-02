if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');

const customMiddlewares = require('./configs/middlewares');

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

app.use('/', rootRouter);
app.use('/cards', cardRouter);
app.use('/rooms', roomRouter);
app.use('/users', usersRouter);

const server = http.createServer(app);

const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('New socket Client');
    socket.emit("hello");
    socket.on('disconnect', () => {
        console.log('Client disconnect');
    });
});

server.listen(4000);
