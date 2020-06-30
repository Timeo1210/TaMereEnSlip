import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';

import Main from './routes/main';
import Home from './routes/Home';
import NotFound from './routes/NotFound';

class App extends React.Component {

    render() {
        return (
            <Router>
                <Main>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route component={NotFound} />
                    </Switch>
                </Main>
            </Router>
        );
    }

}

export default App;
