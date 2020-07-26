const fs = require('fs');
const path = require('path');
const Card = require('../models/Card');
function main() {
    const rawData = fs.readFileSync(`${path.dirname(__dirname)}/cardsList.csv`).toString();
    const rowInData = rawData.split("\n").map((elem) => elem.replace(/(\r\n|\n|\r)/gm, ""));
    for (let i = 0; i < rowInData.length; i++) {
        const caseInRow = rowInData[i].split(',');
        const people = caseInRow[1];
        const object = caseInRow[3];
        const newPeopleCard = new Card({
            type: "people",
            isCustom: false,
            content: people,
        });
        const newObjectCard = new Card({
            type: "object",
            isCustom: false,
            content: object
        });
        addCard(newPeopleCard);
        addCard(newObjectCard)
    }

    async function addCard(card) {
        try {
            const value = await card.save();
            console.log(value);
        } catch (e) {
            console.log(e)
        }
    } 
}

module.exports = main;
