import React from 'react';

import styles from './CreatePlayer.module.css';
import { SocketContext } from '../Contexts/SocketContext';
import { config } from '../../../config';
import axios from 'axios';

class CreatePlayer extends React.Component {

    constructor(props) {
        super(props)

        this.pseudoRef = React.createRef();

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        axios({
            method: 'POST',
            url: `${config.ENDPOINT}/users/login`,
            headers: {
                "username": this.pseudoRef.current.value || "timeo1210",
                "socketid": localStorage.getItem('socketId') || null
            },
            params: {
                newSocketId: this.context.id,
            },
        }).then((data) => {
            //users logged
            localStorage.setItem('socketId', "00fVtCKnJW9xOiVuAAAA");
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.header__bar} ></div>
                    <p className={styles.header__text} >Entrez votre pseudo :</p>
                    <div className={styles.header__bar} ></div>
                </div>
                <div className={styles.inputGroup}>
                    <input ref={this.pseudoRef} className={styles.inputGroup__input} type="text" placeholder="Pseudo" />
                </div>
                <div className={styles.loginSubmit}>
                    <button onClick={this.handleSubmit} className={styles.loginSubmit__input} type="text">Connexion</button>
                </div>
            </div>
        )
    }

}
CreatePlayer.contextType = SocketContext;

export default CreatePlayer;