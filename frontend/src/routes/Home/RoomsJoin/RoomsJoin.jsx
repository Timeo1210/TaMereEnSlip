import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';

import axios from 'axios';
import styles from './RoomsJoin.module.css';
import { PlayerContext } from '../../Contexts/PlayerContext';
import { config } from '../../../config';
import RoomsList from './RoomsList';
import { ReactComponent as CreateGameSVG } from '../../../assets/create_game.svg';
import CreateGame from './CreateGame';

function RoomsJoin(props) {

    const playerContext = useContext(PlayerContext);
    
    const [ rooms, setRooms ] = useState([])
    const [ isDialogOpen, setIsDialogOpen ] = useState(false);

    const getRoomsRequest = () => {
        axios({
            method: 'GET',
            url: `${config.ENDPOINT}/rooms`,
        }).then((data) => {
            //parse rooms and sort it to be the available and most players rooms upper;
            const newRooms = JSON.parse(data.data.rooms)
            .sort((a, b) => {
                return b.players.length > a.players.length ? -1 : 1;
            })
            .sort((a, b) => {
                return a.isJoinable === false || a.isPrivate ? 1 : -1
            });

            setRooms(newRooms)
        }).catch((error) => {
            console.log(error.response)
        });
    }
    const handleRoomJoin = (roomId) => {
        if (playerContext._id === null) return;

        props.history.push(`/play?roomId=${roomId}`);
        
    }
    const handlePlayClick = () => {
        //check if there is a room that can be joined
        if (rooms.length > 0 && rooms[0].isPrivate === false && rooms[0].isJoinable) {
            handleRoomJoin(rooms[0]._id);
        }
    }
    const handleCreateGameButton = () => {
        setIsDialogOpen(!isDialogOpen);
    }

    //componentdidmount and componentwillunmount
    useEffect(() => {
        getRoomsRequest();
        let roomsReqIneterval = setInterval(getRoomsRequest, 2000)
        return () => {
            clearInterval(roomsReqIneterval);
        }
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.playInterface}>
                <button onClick={handlePlayClick} className={styles.playInterface__play}>Jouer</button>
                <div onClick={handleCreateGameButton} className={styles.playInterface__create}>
                    <div className={styles.playInterface__create__button}>
                        <CreateGameSVG />
                        <span className={styles.playInterface__create__text}>Créer</span>
                    </div>
                </div>
            </div>
            <div className={styles.header}>
                <div className={styles.header__bar}></div>
                <p className={styles.header__text}>Rejoindre une partie :</p>
                <div className={styles.header__bar}></div>
            </div>
            <RoomsList rooms={rooms} handleRoomJoin={handleRoomJoin} />
            <CreateGame isOpen={isDialogOpen} handleIsOpen={handleCreateGameButton} handleRoomJoin={handleRoomJoin} />
            {playerContext._id === null && <div className={styles.disabled}></div>}
        </div>
    )
}
// eslint-disable-next-line
RoomsJoin = withRouter(RoomsJoin);

export default RoomsJoin;