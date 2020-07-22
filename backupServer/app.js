if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');

app.use(express.urlencoded({extended: true}));
app.use(cors());

var TaMereEnSlip_server_ip = null;

app.get('/ip', (req, res) => {
    if (TaMereEnSlip_server_ip !== null) {
        res.status(200).json({
            "ip": TaMereEnSlip_server_ip
        });
    } else {
        res.sendStatus(404);
    }
});

app.post('/ip', (req, res) => {
    try {
        const crendentials = req.query.password;
        if (crendentials === process.env.PASSWORD) {
            TaMereEnSlip_server_ip = req.query.ip;
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        console.log(e)
        res.sendStatus(500);
    }
})


const server = http.createServer(app);
server.listen(process.env.PORT || 4998);