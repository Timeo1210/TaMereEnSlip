import React, { useContext, useState, useEffect, useRef } from 'react';

import axios from 'axios';
import styles from './AdminTools.module.css';
import { config } from '../../../config';
import { 
    FormControlLabel, 
    Checkbox, 
    CircularProgress, 
    Input,
    NativeSelect,
    InputLabel, 
    FormControl,
    FormHelperText,
    Button,
} from '@material-ui/core';
import { RoomContext } from '../../Contexts/RoomContext';
import { PlayerContext } from '../../Contexts/PlayerContext';
import { ReactComponent as CopySVG } from '../../../assets/copy.svg'

function AdminTools() {

    const roomContext = useContext(RoomContext);
    const playerContext = useContext(PlayerContext);

    const fakeTextCopyRef = useRef();

    const [ isPlayerAdmin, setIsPlayerAdmin ] = useState(false);
    const [ isOptionsChangable, setIsOptionsChangable ] = useState(true);
    const [ sharableLinkCopyDisplay, setSharableLinkCopyDisplay ] = useState(false);

    const doPatchRequest = (param = {}) => {
        if (isOptionsChangable)  {
            setIsOptionsChangable(false);
            axios({
                method: 'PATCH',
                url: `${config.ENDPOINT}/rooms/${roomContext._id}`,
                headers: {
                    "username": playerContext.name,
                    "socketid": playerContext.socketId,
                    "roomid": roomContext._id
                },
                params: param
            }).then((data) => {
                setIsOptionsChangable(true)
            }).catch((error) => {
                setIsOptionsChangable(true)
                console.log(error.response)
            })
        }
    }

    //optimise
    const handleIsCustomCards = (event) => {
        const checked = event.target.checked;
        doPatchRequest({
            isCustomCard: checked
        }); 
    }
    const handleMaxPlayer = (event) => {
        const value = parseInt(event.target.value);
        if (value >= roomContext.players.length) {
            doPatchRequest({
                maxPlayer: value
            })
        }
    }
    const handleTimerStartTime = (event) => {
        const value = parseInt(event.target.value);
        if (value >= 10) {
            doPatchRequest({
                timerStartTime: value
            });
        }
    }
    const handleIsPrivate = (event) => {
        const checked = event.target.checked;
        doPatchRequest({
            isPrivate: checked
        });
    }
    const handleSetAdmin = (event) => {
        const value = event.target.value;
        if (value !== undefined && value !== null && value.length > 0) {
            roomContext.admins.push(value)
            doPatchRequest({
                admins: roomContext.admins
            });
        }
    }
    const handleKickPlayer = (event) => {
        const value = event.target.value;
        if (isOptionsChangable)  {
            setIsOptionsChangable(false);
            axios({
                method: 'PUT',
                url: `${config.ENDPOINT}/rooms/${roomContext._id}/kick/users/${value}`,
                headers: {
                    "username": playerContext.name,
                    "socketid": playerContext.socketId,
                    "roomid": roomContext._id
                },
            }).then((data) => {
                setIsOptionsChangable(true)
            }).catch((error) => {
                setIsOptionsChangable(true)
                console.log(error.response)
            })
        }
    }
    const handleStart = () => {
        if (isOptionsChangable)  {
            setIsOptionsChangable(false);
            axios({
                method: 'PUT',
                url: `${config.ENDPOINT}/rooms/${roomContext._id}/start`,
                headers: {
                    "username": playerContext.name,
                    "socketid": playerContext.socketId,
                    "roomid": roomContext._id
                },
            }).then((data) => {
                setIsOptionsChangable(true)
            }).catch((error) => {
                setIsOptionsChangable(true)
                console.log(error.response)
            })
        }
    }
    const handleSharableLink = () => {
        setSharableLinkCopyDisplay(true)
        setTimeout(() => {
            setSharableLinkCopyDisplay(false)
        }, 1000);
        fakeTextCopyRef.current.focus()
        fakeTextCopyRef.current.select()
        document.execCommand('copy')
    }

    // check If Player Is Admin
    useEffect(() => {
        if (roomContext._id !== null && !isPlayerAdmin) {
            if (roomContext.admins.some((elem) => elem === playerContext._id)) {
                setIsPlayerAdmin(true);
            }
        }
    }, [roomContext, isPlayerAdmin, playerContext._id]);
    
    if (isPlayerAdmin) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.header__bar}></div>
                    <p className={styles.header__text}>Options de la partie :</p>
                    <div className={styles.header__bar}></div>
                </div>
                {!isOptionsChangable && <CircularProgress color="secondary" /> }
                <div className={`${styles.tools__container} 
                                ${!isOptionsChangable ? styles.tools__disabled : ''}`}>

                    {!isOptionsChangable && <div className={styles.tools__surface}></div>}
                    <div className={styles.tools__isCustomCards}>
                        <FormControlLabel
                            onChange={handleIsCustomCards}
                            checked={roomContext.isCustomCard}
                            control={
                                <Checkbox />
                            }
                            labelPlacement="start"
                            label="Utiliser des cartes customisées"
                        />
                    </div>
                    <div className={styles.tools__maxPlayer}>
                        <FormControlLabel
                            onChange={handleMaxPlayer}
                            value={roomContext.maxPlayer} 
                            control={
                                <Input className={styles.tools__maxPlayer__input} type="number" color="secondary" />
                            }
                            labelPlacement="start"
                            label="Nombre de joueurs maximum :"
                        />
                    </div>
                    <div className={styles.tools__timerStartTime}>
                        <FormControlLabel
                            onChange={handleTimerStartTime}
                            value={roomContext.timerStartTime} 
                            control={
                                <Input className={styles.tools__timerStartTime__input} type="number" color="secondary" />
                            }
                            labelPlacement="start"
                            label="Temps par tour (s) :"
                        />
                    </div>
                    <div className={styles.tools__isPrivate}>
                        <FormControlLabel 
                            onChange={handleIsPrivate}
                            value={roomContext.isPrivate}
                            control={
                                <Checkbox />
                            }
                            labelPlacement="start"
                            label="Partie Privée :"
                        />
                    </div>
                    <div className={styles.tools__setAdmin}>
                    <FormControlLabel 
                        labelPlacement="start"
                        label="Ajouter un admin :"
                        control={
                            <FormControl className={styles.tools__setAdmin__select}>
                                <InputLabel htmlFor="setAdmin-pseudo-select">Pseudo</InputLabel>
                                <NativeSelect
                                    value={''}
                                    onChange={handleSetAdmin}
                                    inputProps={{
                                        id: 'setAdmin-pseudo-select',
                                    }}
                                >
                                    <option aria-label="None" value="" />
                                    {roomContext.players.filter((elem) => roomContext.admins.indexOf(elem._id) === -1 ? true : false ).map((elem, index) => {
                                        return <option key={index} value={elem._id} >{elem.name}</option>
                                    })}
                                </NativeSelect>
                                <FormHelperText>Cette action est definitive</FormHelperText>
                            </FormControl>
                        }
                    />
                    </div>
                    <div className={styles.tools__kickPlayer}>
                    <FormControlLabel 
                        labelPlacement="start"
                        label="Kick un joueur :"
                        control={
                            <FormControl className={styles.tools__kickPlayer__select}>
                                <InputLabel htmlFor="kickPlayer-pseudo-select">Pseudo</InputLabel>
                                <NativeSelect
                                    value={''}
                                    onChange={handleKickPlayer}
                                    inputProps={{
                                        id: 'kickPlayer-pseudo-select',
                                    }}
                                >
                                    <option aria-label="None" value="" />
                                    {roomContext.players.map((elem, index) => {
                                        return <option key={index} value={elem._id} >{elem.name}</option>
                                    })}
                                </NativeSelect>
                                <FormHelperText>Cette action est definitive</FormHelperText>
                            </FormControl>
                        }
                    />
                    </div>
                    <div className={styles.tools__sharableLink}>
                        <textarea ref={fakeTextCopyRef} className={styles.tools__sharableLink__fakeButton} defaultValue={window.location.href}></textarea>
                        <p onClick={handleSharableLink} className={styles.tools__sharableLink__text}>
                            Copier le lien d'invitation <CopySVG />
                            {sharableLinkCopyDisplay &&
                            <span className={styles.tools__sharableLink__animText}>Copié !</span>
                            }
                        </p>
                    </div>
                    {roomContext.isJoinable && 
                    <div className={styles.tools__startGame}>
                        <Button onClick={handleStart} variant="contained" color="primary" >Commencer</Button>
                    </div>}
                </div>
            </div>
        );
    } else {
        return (
            <></>
        )
    }
}

export default AdminTools;