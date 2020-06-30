import React from 'react';

export const PlayerContext = React.createContext(null);

export class PlayerProvider extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            _id: null,
            cards: null,
            name: null,
            socketId: null,
            __v: null,
            turn: 0,
            setContext: (value) => {
                console.log(value)
                this.setState(value)
            }
        }
    }

    render() {
        return (
            <PlayerContext.Provider value={this.state}>
                {this.props.children}
            </PlayerContext.Provider>
        )
    }

}