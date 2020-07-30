import React, { useState, useEffect, useContext, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import {
    Button,
    LinearProgress,
    CircularProgress,
    Slide
} from '@material-ui/core';

import axios from 'axios';
import { config, middlewares } from '../../../config';
import styles from './Main.module.css';
import { RoomContext } from '../../Contexts/RoomContext';
import { SocketContext } from '../../Contexts/SocketContext';
import { PlayerContext } from '../../Contexts/PlayerContext';

function Main(props) {

    const roomContext = useContext(RoomContext);
    const socketContext = useContext(SocketContext);
    const playerContext = useContext(PlayerContext);

    const [ isPlayerAdmin, setIsPlayerAdmin ] = useState(false);
    const [ isTimerOn, setIsTimerOn ] = useState(false);
    const [ timerTime, setTimerTime ] = useState();

    const handleTimerAction = () => {
        setIsTimerOn(!isTimerOn)
        const statusText = !isTimerOn ? 'RESUME' : 'PAUSE'
        socketContext.emit(`TOROOM::TIMER:${statusText}`, timerTime);
    }
    const handleLeave = () => {
        props.setDisplayComponents(false);
        setTimeout(() => {
            window.location.replace("/");
        }, 500)
        //force not to save context
    }
    const handleRematch = () => {
        props.setDisplayComponents(false);
        setTimeout(() => {
            axios({
                method: 'PUT',
                url: `${config.ENDPOINT}/rooms/${roomContext._id}/rematch`,
                headers: {
                    "username": playerContext.name,
                    "socketid": playerContext.socketId,
                    "roomid": roomContext._id
                },
            });
        }, 500);
    }

    //CHECK IF PLAYER IS ADMIN
    useEffect(() => {
        if (roomContext.admins.some((elem) => elem === playerContext._id)) {
            setIsPlayerAdmin(true)
        }
    }, [roomContext.admins, playerContext._id])

    //INIT SOCKET AND TIMER
    useEffect(() => {
        setTimerTime(roomContext.timerStartTime);
        socketContext.on('TIMER:RESUME', (data) => {
            setIsTimerOn(true);
            setTimerTime(data);
        });

        socketContext.on('TIMER:PAUSE', (data) => {
            setIsTimerOn(false);
            setTimerTime(data);
        });

    }, [socketContext, roomContext.timerStartTime]);

    // GET ALL USERS
    useEffect(() => {
        const fetchData = async () => {
            if (typeof roomContext.players[0] === 'string') {
                const newPlayers = await Promise.all(roomContext.players.map(async (elem) => {
                    const playerData = await axios({
                        method: 'GET',
                        url: `${config.ENDPOINT}/users/${elem}`,
                    });
                    //get cards
                    const newCards = await Promise.all(playerData.data.cards.map(async (elem) => {
                        const cardData = await axios({
                            method: 'GET',
                            url: `${config.ENDPOINT}/cards/${elem}`
                        });
                        return cardData.data;
                    }))
                    playerData.data.cards = newCards;
                    return playerData.data;
                }));
                roomContext.setContext({
                    players: newPlayers
                });
                props.setDisplayComponents(true)
            }
        }
        if (typeof roomContext.players[0] == 'string') fetchData();

        //eslint-disable-next-line
    }, [roomContext])

    //INIT INTERVAL FOR TIMER
    useInterval(() => {
        if (isTimerOn) {
            if (timerTime === 0) setTimeout(() => setTimerTime(roomContext.timerStartTime), 3000)
            else if (timerTime > 0) setTimerTime(timerTime - 1)
        }
    }, isTimerOn ? 1000 : null);

    const timerStateText = isTimerOn ? 'PAUSE' : 'REPRENDRE';
    const progressValue = timerTime / roomContext.timerStartTime * 100;
    return (
        <Slide in={props.display} direction="left" timeout={500}>
            <div className={styles.container}>
                <LinearProgress className={styles.timerBar} variant="determinate" value={progressValue} />
                <PlayerList players={roomContext.players} playerId={playerContext._id} />
                {isPlayerAdmin && 
                <Button onClick={handleTimerAction} variant="contained" color="primary">
                    {timerStateText}
                </Button>}
                <div className={styles.footerActions}>
                    {isPlayerAdmin && 
                    <Button onClick={handleRematch} variant="contained" color="primary">
                        REJOUER
                    </Button>}
                    <Button onClick={handleLeave} variant="contained" color="primary">
                        QUITTER
                    </Button>
                </div>
            </div>
        </Slide>
    )
}
// eslint-disable-next-line
Main = withRouter(Main);

function PlayerList(props) {
    if (typeof props.players[0] === 'string') {
        return (
            <div className={styles.playersList}>
                <CircularProgress />
            </div>
        )
    } else {
        return (
            <div className={styles.playersList}>
                {props.players.filter((elem) => elem._id !== props.playerId).map((elem, index) => {
                    return <PlayerItem key={index} player={elem} />
                })}
            </div>
        )
    }
}

function PlayerItem(props) {
    return (
        <div className={styles.playersList__item}>
            <p className={styles.playersList__item__name}>{props.player.name}</p>
            <img src={middlewares.getImageProfil(props.player.imageProfil)} alt=""/>
            <div className={styles.playersList__item__cards}>
                <Card card={props.player.cards[0]} />
                <Card card={props.player.cards[1]} />
            </div>
        </div>
    )
}

function Card(props) {
    const headerText = props.card.type === "people" ? "Personne" : "Action";
    return (
        <div className={[styles.card, styles[`card__${props.card.type}`]].join(' ')}>
            <div className={styles.header}>
                <div className={styles.header__bar}></div>
                <p className={styles.header__text}>{headerText}</p>
                <div className={styles.header__bar}></div>
            </div>
            <p className={styles.card__content}>{props.card.content}</p>
        </div>
    )
}

function useInterval(callback, delay) {
    // CREDITS: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
}

export default Main;