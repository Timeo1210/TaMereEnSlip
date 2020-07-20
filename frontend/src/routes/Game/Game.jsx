import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import axios from 'axios';
import styles from './Game.module.css';
import { CircularProgress } from '@material-ui/core';
import { config } from '../../config';
import { PlayerContext } from '../Contexts/PlayerContext';
import { SocketContext } from '../Contexts/SocketContext';
import { RoomContext } from '../Contexts/RoomContext';

import PlayerWaitingList from './PlayerWaitingList';
import AdminTools from './AdminTools';
import ChooseCustomCards from './ChooseCustomCards';
import Main from './Main';

function Game(props) {
    
    const playerContext = useContext(PlayerContext);
    const socketContext = useContext(SocketContext);
    const roomContext = useContext(RoomContext);

    const [ isPlayerLogged , setIsPlayerLogged ] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    // disable all after if roomId is undefined;

    // logged player if not
    useEffect(() => {
        if (roomId === undefined) return;
        if (playerContext._id !== null) setIsPlayerLogged(true)
        else if (localStorage.getItem('username') && localStorage.getItem('socketId')) {
            axios({
                method: 'POST',
                url: `${config.ENDPOINT}/users/login`,
                headers: {
                    "username": localStorage.getItem('username'),
                    "socketid": localStorage.getItem('socketId') || null
                },
                params: {
                    newSocketId: socketContext.id,
                }
            }).then((data) => {
                //users logged
                localStorage.setItem('socketId', data.data.socketId)
                console.log(localStorage.getItem('socketId'))
                playerContext.setContext(data.data);
                setIsPlayerLogged(true)
            }).catch((error) => {
                console.log(error.response)
            });
        } else {
            console.log("NOT LOGGED")
        }
    }, [playerContext, roomId, socketContext.id]);

    // join room and get get the room info
    useEffect(() => {
        if (isPlayerLogged && roomContext._id === null) {

            socketContext.on('GET:/room', () => {
                console.log('GETTING ROOM')
                axios({
                    method: "GET",
                    url: `${config.ENDPOINT}/rooms/${roomId}`,
                    headers: {
                        "username": playerContext.name,
                        "socketid": playerContext.socketId 
                    }
                }).then((data) => {
                    // should update players
                    /*
                    if (roomContext.players !== null && typeof roomContext.players[0] !== 'string') {
                        console.log('AFTER')
                        if (roomContext.players.length === data.data.players.length) {
                            if (roomContext.players.some((elem, index) => elem._id !== data.data.players[index])) {
                                console.log(roomContext)
                                console.log(data.data)
                                console.log("TYRUE")
                            } else {
                                console.log(roomContext)
                                console.log(data.data)
                                console.log("FALSE")
                            }
                        }
                    }
                    */

                    /* check if player is in the players */
                    if (!data.data.players.includes(playerContext._id)) {
                        // PLAYER LEAVE
                        props.history.push(`/`);
                    }
                    //props.history.push(`/`);
                    roomContext.setContext(data.data);
                }).catch((error) => {
                    console.log(error.response);
                })
            });
            
            axios({
                method: 'PUT',
                url: `${config.ENDPOINT}/rooms/${roomId}/join`,
                headers: {
                    "username": playerContext.name,
                    "socketid": playerContext.socketId 
                }
            }).then((data) => {
                console.log("JOINED")
                socketContext.emit("/rooms/join", playerContext, roomId);
            }).catch((error) => {
                console.log(error.response);
            });
            
        }
    }, [isPlayerLogged, playerContext, roomId, socketContext, roomContext, props.history]);

    if (isPlayerLogged) {
        //if game wait for chosing card
        if (!roomContext.isJoinable && roomContext.isCustomCard && !roomContext.isGameHasStart) {
            return (
                <div className={styles.container}>
                    <ChooseCustomCards />
                </div>
            )
        } else if (!roomContext.isJoinable && roomContext.isGameHasStart) {
            //if game has started
            return (
                <div className={styles.container}>
                    <Main />
                </div>
            )
        } else {
            return (
                <div className={styles.container}>
                    <PlayerWaitingList />
                    <AdminTools />
                </div>
            );
        }
    } else {
        //if game wait for player
        return (
            <div className={styles.container}>
                <CircularProgress color="secondary" />
            </div>
        );
    }
}
// eslint-disable-next-line
Game = withRouter(Game);

export default Game;