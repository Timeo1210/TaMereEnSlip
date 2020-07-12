import React from 'react';

import { middlewares } from '../../../../config';
import styles from './RoomsList.module.css';
import { ReactComponent as PADLOCK_LOCK } from '../../../../assets/padlock_lock.svg';
import { ReactComponent as PADLOCK_UNLOCK } from '../../../../assets/padlock_unlock.svg';

function RoomsList(props) {

    return (
        <div className={styles.container}>
            {props.rooms.map((room, index) => <ListComponent key={index} room={room} handleRoomJoin={props.handleRoomJoin}  />)}
        </div>
    )
}

function ListComponent(props) {

    const handleRoomJoin = () => {
        if (props.room.isJoinable && !props.room.isPrivate) {
            props.handleRoomJoin(props.room._id);
        }
    }

    return (
        <div onClick={handleRoomJoin} className={`${styles.room__container} 
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
                    <PADLOCK_LOCK /> 
                    : <PADLOCK_UNLOCK />}
                </div>
                <div className={styles.room__playersNumber}>
                    {props.room.players.length} / <span>{props.room.maxPlayer}</span>
                </div>
            </div>
        </div>
    )
}

export default RoomsList;