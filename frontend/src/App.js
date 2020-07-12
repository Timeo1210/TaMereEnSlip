import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';

import Main from './routes/main';
import Home from './routes/Home';
import Game from './routes/Game';
import NotFound from './routes/NotFound';

import { SocketProvider } from './routes/Contexts/SocketContext';
import { PlayerProvider } from './routes/Contexts/PlayerContext';
import { RoomProvider } from './routes/Contexts/RoomContext';

class App extends React.Component {

    render() {
        return (
            <Router>
                <SocketProvider>
                <PlayerProvider>
                <RoomProvider>
                    <Main>
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/play" component={Game} />
                            <Route component={NotFound} />
                        </Switch>
                    </Main>
                </RoomProvider>
                </PlayerProvider>
                </SocketProvider>
            </Router>
        );
    }

}

export default App;
