const express = require('express');
const router = express.Router();

const Card = require('../models/Card');
const PeopleCard = require('../models/PeopleCard');
const ObjectCard = require('../models/ObjectCard');

router.get('/', async (req, res) => {
    const cards = await Card.find();

    res.status(200).json({
        "msg": "hello world !",
        "card": JSON.stringify(cards),
    });
});

router.post('/', async (req, res) => {
    const card = new Card({
        type: req.body.type,
        content: req.body.content,
        isCustom: req.body.isCustom,
    });
    try {
        const newCard = await card.save();
        if (newCard.type === "people") {
            const peopleCard = new PeopleCard({
                card_id: newCard.id,
            });
            await peopleCard.save();
        } else if (newCard.type === "object") {
            const objectCard = new ObjectCard({
                card_id: newCard.id,
            });
            await objectCard.save();
        }

        res.status(200).json({
            "status": "created",
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            "message": "error",
        });
    }
});

router.get('/people', async (req, res) => {
    const peopleCards = (await PeopleCard.find()).map((card) => card.card_id);
    res.status(200).json({
        "data": JSON.stringify(peopleCards),
    });
});

router.get('/object', async (req, res) => {
    const objectCards = (await ObjectCard.find()).map((card) => card.card_id);
    res.status(200).json({
        "data": JSON.stringify(objectCards),
    });
});

router.get('/:id', async (req, res) => {
    const card = await Card.findById(req.params.id);
    res.status(200).json({
        "data": JSON.stringify(card),
    });
});

module.exports = router;
