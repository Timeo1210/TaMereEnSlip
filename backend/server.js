/*
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
*/

// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');

// const rootRouter = require('./routes/root');
// const cardRouter = require('./routes/card');

// app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
// app.use(express.urlencoded({extended: true}));
/*
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

const Test = require('./test');
app.use('/', (req, res, next) => {
    console.log('TES');
    next();
});
*/

// app.use('/', rootRouter);
/* app.use('/cards', cardRouter); */

// app.listen(process.env.PORT || 4000);
