import React, { useContext, useEffect, useState, useRef } from 'react';

import axios from 'axios';
import { config, middlewares } from '../../../config';
import styles from './ChooseCustomCards.module.css';
import {
    CircularProgress,
    TextareaAutosize,
    Button
} from '@material-ui/core';
import { RoomContext } from '../../Contexts/RoomContext';
import { PlayerContext } from '../../Contexts/PlayerContext';

function ChooseCustomCards() {

    const playerContext = useContext(PlayerContext);
    const roomContext = useContext(RoomContext);

    const [ playerCardsChange, setPlayerCardsChange ] = useState();

    const peopleTextRef = useRef();
    const objectTextRef = useRef();

    const handleSubmit = () => {
        const peopleText = peopleTextRef.current.value;
        const objectText = objectTextRef.current.value;
        axios({
            method: 'PUT',
            url: `${config.ENDPOINT}/users/${playerCardsChange._id}/customCards`,
            headers: {
                "username": playerContext.name,
                "socketid": playerContext.socketId
            },
            params: {
                objectCardText: objectText,
                peopleCardText: peopleText,
                roomid: roomContext.id
            }
        });
    }

    useEffect(() => {
        try {
            const playersCardsChange = roomContext.cardsCanBeSetBy.find((elem) => elem[0] === playerContext._id);
            if (!playersCardsChange) return setPlayerCardsChange(undefined);
            const playerCardsChangeId = playersCardsChange[1]
            if (playerCardsChange === undefined) {
                axios({
                    method: 'GET',
                    url: `${config.ENDPOINT}/users/${playerCardsChangeId}`,
                    headers: {
                        "username": playerContext.name,
                        "socketid": playerContext.socketId || null
                    }
                }).then((data) => {
                    setPlayerCardsChange(data.data);
                }).catch((error) => {
                    console.log(error);
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, [playerContext, roomContext.cardsCanBeSetBy, playerCardsChange]);


    if (playerCardsChange) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.header__bar}></div>
                    <p className={styles.header__text}>Choisissez les cartes pour :</p>
                    <div className={styles.header__bar}></div>
                </div>
                <div className={styles.playerCardsChange}>
                    <img src={middlewares.getImageProfil(playerCardsChange.imageProfil)} alt=""/>
                    <p> {playerCardsChange.name} </p>
                </div>
                <div className={styles.cards}>
                    <div className={[styles.card, styles.card__people].join(' ')}>
                        <div className={[styles.header, styles.card__header].join(' ')}>
                            <div className={styles.header__bar}></div>
                                <p className={styles.header__text}>Personne :</p>
                            <div className={styles.header__bar}></div>
                        </div>
                        <TextareaAutosize
                            id="outlined-number"
                            type="text"
                            variant="outlined"
                            className={styles.card__input}
                            ref={peopleTextRef}
                        />
                    </div>
                    <div className={[styles.card, styles.card__object].join(' ')}>
                        <div className={[styles.header, styles.card__header].join(' ')}>
                            <div className={styles.header__bar}></div>
                            <p className={styles.header__text}>Action :</p>
                            <div className={styles.header__bar}></div>
                        </div>
                        <TextareaAutosize
                            id="outlined-number"
                            type="text"
                            variant="outlined"
                            className={styles.card__input}
                            ref={objectTextRef}
                        />
                    </div>
                </div>
                <div className={styles.submit}>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        CHOISIR
                    </Button>
                </div>
            </div>
        )
    } else {
        return (
            <div className={styles.container}>
                <CircularProgress />
            </div>
        );
    }
}

export default ChooseCustomCards;