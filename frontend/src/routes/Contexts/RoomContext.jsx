import React from 'react';

export const RoomContext = React.createContext(null);

export class RoomProvider extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            admins: null,
            id: null,
            isCustomcard: null,
            isJoinable: null,
            isPrivate: null,
            isGameHasStart: null,
            maxPlayer: null,
            name: null,
            players: null,
            roomImageProfil: null,
            turn: null,
            cardsCanBeSetBy: null,
            _id: null,
            __b: null,
            setContext: (value) => {
                this.setState(value)
            }
        }
    }

    render() {
        return (
            <RoomContext.Provider value={this.state}>
                {this.props.children}
            </RoomContext.Provider>
        )
    }

}