import React from 'react';

import styles from './Home.module.css';
import CreatePlayer from './CreatePlayer';
import RoomsJoin from './RoomsJoin';
import { PlayerContext } from '../Contexts/PlayerContext';

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isPlayerLogged: false,
            displayComponents: true
        };

        this.handleIsPlayerLogged = this.handleIsPlayerLogged.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this)
    }

    componentDidMount() {
        if (this.context._id !== null) {
            this.setState({
                isPlayerLogged: true
            });
        }
    }

    handleIsPlayerLogged() {
        this.setState({
            isPlayerLogged: true
        });
    }

    handleChangePage() {
        this.setState({
            displayComponents: false
        })
    }

    render() {
        const { isPlayerLogged, displayComponents } = this.state;
        const roomJoinStyles = {}
        if (isPlayerLogged) {
            roomJoinStyles.height = "100%";
        }
        return (
            <div className={styles.container}>
                { !isPlayerLogged && <CreatePlayer handleIsPlayerLogged={this.handleIsPlayerLogged} display={displayComponents} />}
                <RoomsJoin styles={roomJoinStyles} isPlayerLogged={isPlayerLogged} display={displayComponents} handleChangePage={this.handleChangePage} />
            </div>
        );
    }

}
Home.contextType = PlayerContext;

export default Home;
