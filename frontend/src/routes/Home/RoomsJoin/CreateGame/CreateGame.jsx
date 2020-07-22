import React, { useContext, createRef } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText
} from '@material-ui/core';

import axios from 'axios';
import { config } from '../../../../config';
import { PlayerContext } from '../../../Contexts/PlayerContext';

function CreateGame(props) {

    const playerContext = useContext(PlayerContext);

    const nameRef = createRef();

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleCreateGame();
        }
    }
    const handleCreateGame = () => {
        const name = nameRef.current.value;

        if (name.length > 0) {
            axios({
                method: 'POST',
                url: `${config.ENDPOINT}/rooms/`,
                headers: {
                    username: playerContext.name,
                    socketid: playerContext.socketId
                },
                params: {
                    name,
                }
            }).then((data) => {
                const roomId = data.data.room_id;
                props.handleRoomJoin(roomId);
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    return (
        <Dialog open={props.isOpen} fullWidth={true} maxWidth="sm" aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Crée une partie</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Donner un nom à votre partie
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nom de la partie"
                    type="text"
                    fullWidth
                    inputRef={nameRef}
                    onKeyDown={handleKeyDown}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleIsOpen} color="primary">
                    ANNULER
                </Button>
                <Button onClick={handleCreateGame} color="primary">
                    CRÉER
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateGame;