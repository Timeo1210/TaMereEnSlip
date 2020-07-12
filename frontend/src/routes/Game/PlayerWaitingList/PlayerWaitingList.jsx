import React, { useContext, useEffect } from 'react';

import axios from 'axios';
import styles from './PlayerWaitingList.module.css';
import { CircularProgress } from '@material-ui/core';
import { config, middlewares } from '../../../config';
import { RoomContext } from '../../Contexts/RoomContext';

function PlayerWaitingList() {

    const roomContext = useContext(RoomContext);

    useEffect(() => {
        async function fetchData() {
            const newPlayers = await Promise.all(roomContext.players.map(async (elem) => {
                const data = await axios({
                    method: 'GET',
                    url: `${config.ENDPOINT}/users/${elem}`
                })
                return data.data;
            }));
            return newPlayers;
        }
        if (roomContext._id !== null) {
            if (typeof roomContext.players[0] === 'string') {
                fetchData()
                .then((newPlayers) => {
                    roomContext.setContext({
                        players: newPlayers,
                    });
                })
                .catch((error) => {
                    console.log(error)
                })
            }
        }
    }, [roomContext]);

    if (roomContext.players !== null && typeof roomContext.players[0] === 'object') {
        return (
            <div className={styles.container}>
                <p>JOUEURS :</p>
                <div className={styles.playersContainer}>
                    {roomContext.players.map((player, index) => {
                        return <PlayerDiv key={index} player={player} />
                    })}
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.container}>
                <CircularProgress color="secondary" />
            </div>
        );
    }

}

function PlayerDiv(props) {

    return (
        <div className={styles.PlayerDiv__container}>
            <img src={`${middlewares.getImageProfil(props.player.imageProfil)}`} alt=""/>
            <p> {props.player.name} </p>
        </div>
    )

}

export default PlayerWaitingList;