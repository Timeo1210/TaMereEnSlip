import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { config, middlewares } from '../../../../config';
import styles from './RoomsList.module.css';
import { ReactComponent as Padlock_Lock } from '../../../../assets/padlock_lock.svg';
import { ReactComponent as PadLock_Unlock } from '../../../../assets/padlock_unlock.svg';

function RoomsList() {

    const [rooms, setRooms] = useState([])

    //componentdidmount
    useEffect(() => {
        axios({
            method: 'GET',
            url: `${config.ENDPOINT}/rooms`,
        }).then((data) => {
            console.log(JSON.parse(data.data.rooms));
            setRooms(JSON.parse(data.data.rooms))
        }).catch((error) => {
            console.log(error.response)
        });
    }, []);

    return (
        <div className={styles.container}>
            {rooms.map((room, index) => <ListComponent key={index} room={room}  />)}
        </div>
    )
}

function ListComponent(props) {

    

    return (
        <div className={`${styles.room__container} 
                         ${props.room.isJoinable === false || props.room.isPrivate ? styles.room__disabled : ''}`}>
            <div className={styles.leftPart}>
                <div className={styles.room__imageProfil}>
                    <img src={middlewares.getImageProfil(props.room.roomImageProfil)} alt=""/>
                </div>
                <div className={styles.room__info}>
                    <div className={styles.room__info__title}>
                        {props.room.name}
                    </div>
                    {props.room.players.length !== 0 ? 
                    <div className={styles.room__info__players}>
                        {props.room.players.map((elem, index) => {
                            return <img key={index} src={middlewares.getImageProfil(elem.imageProfil)} alt=""/>
                        })}
                    </div> 
                    : <></>}
                </div>
            </div>
            <div className={styles.rightPart}>
                <div className={styles.room__isJoinable}>
                    {props.room.isJoinable === false || props.room.isPrivate ? 
                    <Padlock_Lock /> 
                    : <PadLock_Unlock />}
                </div>
                <div className={styles.room__playersNumber}>
                    {props.room.players.length} / <span>{props.room.maxPlayer}</span>
                </div>
            </div>
        </div>
    )
}

export default RoomsList;