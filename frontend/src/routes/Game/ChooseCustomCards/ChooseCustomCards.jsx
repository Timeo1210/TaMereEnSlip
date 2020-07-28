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
    const [ peopleTextErrorDisplay, setPeopleTextErrorDisplay ] = useState(false);
    const [ objectTextErrorDisplay, setObjectTextErrorDisplay ] = useState(false);
    const [ peopleTextErrorMessage, setPeopleTextErrorMessage ] = useState("");
    const [ objectTextErrorMessage, setObjectTextErrorMessage ] = useState("");

    const peopleTextRef = useRef();
    const objectTextRef = useRef();

    const handleSubmit = () => {
        const peopleText = peopleTextRef.current.value;
        const objectText = objectTextRef.current.value;
        const peopleValide = handlePeopleTextValidation(peopleText)
        const objectValide = handleObjectTextValidation(objectText)
        if (peopleValide && objectValide) {
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
    }
    const getErrorMessage = (text) => {
        text = text.trim();
        if (text === "") {
            return "Le champ doit être rempli"
        } else if (text.length > 30) {
            return "Le champ est trop long"
        }
        return false
    }
    const handlePeopleTextValidation = (peopleText) => {
        const errorMessage = getErrorMessage(peopleText)
        if (errorMessage) {
            console.log(peopleTextErrorDisplay)
            if (!peopleTextErrorDisplay) setPeopleTextErrorDisplay(true);
            if (errorMessage !== peopleTextErrorMessage) setPeopleTextErrorMessage(errorMessage);
            return false
        } else {
            if (peopleTextErrorDisplay) setPeopleTextErrorDisplay(false);
            return true
        }
    }
    const handleObjectTextValidation = (objectText) => {
        const errorMessage = getErrorMessage(objectText)
        if (errorMessage) {
            if (!objectTextErrorDisplay) setObjectTextErrorDisplay(true);
            if (errorMessage !== objectTextErrorMessage) setObjectTextErrorMessage(errorMessage);
            return false
        } else {
            if (objectTextErrorDisplay) setObjectTextErrorDisplay(false);
            return true
        }
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
                        <div className={styles.card__controls}>
                            <TextareaAutosize
                                id="outlined-number"
                                type="text"
                                variant="outlined"
                                className={styles.card__input}
                                ref={peopleTextRef}
                                onChange={(e) => handlePeopleTextValidation(e.target.value)}
                            />
                            <div className={styles.card__controls__error__wrapper}>
                                <CardErrorDisplay display={peopleTextErrorDisplay} errorMessage={peopleTextErrorMessage} />
                            </div>
                        </div>
                    </div>
                    <div className={[styles.card, styles.card__object].join(' ')}>
                        <div className={[styles.header, styles.card__header].join(' ')}>
                            <div className={styles.header__bar}></div>
                            <p className={styles.header__text}>Action :</p>
                            <div className={styles.header__bar}></div>
                        </div>
                        <div className={styles.card__controls}>
                            <TextareaAutosize
                                id="outlined-number"
                                type="text"
                                variant="outlined"
                                className={styles.card__input}
                                ref={objectTextRef}
                                onChange={(e) => handleObjectTextValidation(e.target.value)}
                            />
                            <div className={styles.card__controls__error__wrapper}>
                                <CardErrorDisplay display={objectTextErrorDisplay} errorMessage={objectTextErrorMessage} />
                            </div>
                        </div>
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

function CardErrorDisplay(props) {

    if (props.display) {
        return (
            <div className={styles.card__controls__error}>
                {props.errorMessage}
            </div>
        )
    } else {
        return (
            <></>
        )
    }
}

export default ChooseCustomCards;