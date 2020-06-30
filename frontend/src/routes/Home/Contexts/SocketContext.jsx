import React from 'react';
import socketIOClient from 'socket.io-client';
import { config } from '../../../config';
const ENDPOINT = config.ENDPOINT;

export const SocketContext = React.createContext('null');

export class SocketProvider extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            socket: null,
        }
    }

    componentDidMount() {
        const socket = socketIOClient(ENDPOINT);
        socket.on('connect', () => {
            this.setState({
                socket: socket
            });
        })
    }

    render() {
        const { socket } = this.state;
        return (
            <SocketContext.Provider value={socket}>
                {this.props.children}
            </SocketContext.Provider>
        )
    }

}