import React from 'react';

import styles from './Home.module.css';
import CreatePlayer from './CreatePlayer';
import RoomsJoin from './RoomsJoin';

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isPlayerLogged: false,
        };

        this.handleIsPlayerLogged = this.handleIsPlayerLogged.bind(this);
    }

    handleIsPlayerLogged() {
        this.setState({
            isPlayerLogged: true
        });
    }

    render() {
        const { isPlayerLogged } = this.state;
        return (
            <div className={styles.container}>
                { !isPlayerLogged && <CreatePlayer handleIsPlayerLogged={this.handleIsPlayerLogged} />}
                <RoomsJoin isPlayerLogged={isPlayerLogged} />
            </div>
        );
    }

}

export default Home;
