import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import { SocketContext } from './Contexts/SocketContext';

class Main extends React.Component {

    render() {
        const { children } = this.props;
        return (
            <div className="container">
                <header>
                    <Header />
                </header>
                {this.context && 
                <main>
                    {children}
                </main>}
                {/* Add footer here */}
            </div>
        );
    }

}
Main.contextType = SocketContext;

Main.propTypes = {
    children: PropTypes.element.isRequired,
};

export default Main;
