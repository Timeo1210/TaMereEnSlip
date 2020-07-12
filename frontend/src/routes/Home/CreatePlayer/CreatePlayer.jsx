import React, { useRef, useContext, useState } from 'react';

import styles from './CreatePlayer.module.css';
import { SocketContext } from '../../Contexts/SocketContext';
import { PlayerContext } from '../../Contexts/PlayerContext';
import { config } from '../../../config';
import Warning from '../../../assets/warning.svg';
import axios from 'axios';
import ChooseImageProfil from './ChooseImageProfil';

function CreatePlayer(props) {

    const pseudoRef = useRef();
    const buttonSubmitRef = useRef();
    const containerRef = useRef();

    const [invalidPlayer, setInvalidPlayer] = useState(false);
    const [errorMessage, setErrorMessage] = useState("L'utilisateur ne correspond pas a vous ou n'existe pas");
    const [chooseImageProfil, setChooseImageProfil] = useState(false);

    const socketContext = useContext(SocketContext);
    const playerContext = useContext(PlayerContext);

    const allImages = [
        "standard",
        "iroquoise_hair",
    ];

    const userIsLogged = (data) => {
        localStorage.setItem('socketId', data.data.socketId);
        localStorage.setItem('username', data.data.name);
        playerContext.setContext(data.data);
        setInvalidPlayer(false);
        pseudoRef.current.value = '';
        pseudoRef.current.disabled = true;
        buttonSubmitRef.current.disabled = true;
        containerRef.current.setAttribute('style', 'transform: scaleY(0)');
        setTimeout(() => {
            props.handleIsPlayerLogged();
        }, 1000);
    }
    const handleSubmit = () => {
        axios({
            method: 'POST',
            url: `${config.ENDPOINT}/users/login`,
            headers: {
                "username": pseudoRef.current.value,
                "socketid": localStorage.getItem('socketId') || null
            },
            params: {
                newSocketId: socketContext.id,
            }
        }).then((data) => {
            //users logged
            userIsLogged(data)
        }).catch((error) => {
            if (error.response.status === 401) {
                setErrorMessage("L'utilisateur ne correspond pas a vous ou n'existe pas")
                setInvalidPlayer(true);
            }
        });
    }
    const handleCreatePlayer = (imageIndex) => {
        const imageProfil = allImages[imageIndex];
        setChooseImageProfil(false)
        axios({
            method: 'POST',
            url: `${config.ENDPOINT}/users/new`,
            params: {
                username: pseudoRef.current.value,
                socketId: socketContext.id,
                imageProfil,
            }
        }).then((data) => {
            userIsLogged(data)
        }).catch((error) => {
            if (error.response.status === 409) {
                setErrorMessage("L'utilisateur existe déjà");
                setInvalidPlayer(true);
            }
        });
    }
    const handleCreatePlayerButton = () => {
        setChooseImageProfil(true);
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    }
    const handleChooseImageProfilClose = () => {
        setChooseImageProfil(false)
    }

    return (
        <div ref={containerRef} className={styles.container}>
            {invalidPlayer && (
                <>
                    <div className="globalWarning">
                        <div>
                            <img src={Warning} alt="warning"/>
                            <span>Erreur :</span>
                        </div>
                        <p>{errorMessage}</p>
                        <button onClick={handleCreatePlayerButton} className={styles.createPlayerButton}>Créer un compte</button>
                    </div>
                    {chooseImageProfil && <ChooseImageProfil allImages={allImages} handleCreatePlayer={handleCreatePlayer} handleChooseImageProfilClose={handleChooseImageProfilClose} />}
                </>
            )}
            <div className={styles.header}>
                <div className={styles.header__bar} ></div>
                <p className={styles.header__text} >Entrez votre pseudo :</p>
                <div className={styles.header__bar} ></div>
            </div>
            <div className={styles.inputGroup}>
                <input ref={pseudoRef} onKeyPress={handleKeyPress} className={styles.inputGroup__input} type="text" placeholder="Pseudo" />
            </div>
            <div className={styles.loginSubmit}>
                <button ref={buttonSubmitRef} onClick={handleSubmit} className={styles.loginSubmit__input} type="text">Connexion</button>
            </div>
        </div>
    )
}

export default CreatePlayer;