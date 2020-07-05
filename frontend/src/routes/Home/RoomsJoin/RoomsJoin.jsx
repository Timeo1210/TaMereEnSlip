import React from 'react';

import styles from './RoomsJoin.module.css';
import RoomsList from './RoomsList';

function RoomsJoin(props) {

    return (
        <div className={styles.container}>
            <p>HI</p>
            <RoomsList />
        </div>
    )
}

export default RoomsJoin;