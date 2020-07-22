const axios = require('axios');
const http = require('http'); 

function main() {
    const postNewServerIP = (newIP) => {
        axios({
            method: 'POST',
            url: `${process.env.BACKUP_ENDPOINT}/ip`,
            params: {
                password: process.env.BACKUP_PASSWORD,
                ip: newIP
            }
        })
    }
    // GET SERVER IP
    axios.get('http://ipv4bot.whatismyipaddress.com')
    .then((data) => {
        const serverIP = data.data;
        const completeServerIP = `${serverIP}:4999`;
        axios.get(`${process.env.BACKUP_ENDPOINT}/ip`)
        .then((data) => {
            const previousServerIP = data.data.ip
            if (completeServerIP !== previousServerIP) {
                postNewServerIP(completeServerIP);
            }
        })
        .catch((error) => {
            const errorCode = error.response.status;
            if (errorCode === 404) {
                postNewServerIP(completeServerIP)
            } else {
                console.log('BIG ERROR')
            }
        })
    })
    .catch((error) => {
        console.log(error);
    });
}

module.exports = main;