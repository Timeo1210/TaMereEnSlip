import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';

import Initing from './Initing';
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
                <Main>
                    <Initing>
                        <SocketProvider>
                        <PlayerProvider>
                        <RoomProvider>
                            <Switch>
                                <Route exact path="/" component={Home} />
                                <Route exact path="/play" component={Game} />
                                <Route component={NotFound} />
                            </Switch>
                        </RoomProvider>
                        </PlayerProvider>
                        </SocketProvider>
                    </Initing>
                </Main>
            </Router>
        );
    }

}

export default App;
