import React from 'react';
import styles from './Home.module.css';
import { SocketProvider } from './Contexts/SocketContext';
import { PlayerProvider } from './Contexts/PlayerContext';

import CreatePlayer from './CreatePlayer';
import RoomList from './';

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isPlayerLogged: false,
        };

        this.handleIsPlayerLogged = this.handleIsPlayerLogged.bind(this);
    }

    componentDidMount() {

    }

    handleIsPlayerLogged() {
        this.setState({
            isPlayerLogged: true
        });
    }

    render() {
        const { isPlayerLogged } = this.state;
        console.log(isPlayerLogged)
        return (
            <div className={styles.container}>
                <SocketProvider>
                <PlayerProvider>
                    { !isPlayerLogged && <CreatePlayer handleIsPlayerLogged={this.handleIsPlayerLogged} />}
                </PlayerProvider>
                </SocketProvider>
            </div>
        );
    }

}

export default Home;
