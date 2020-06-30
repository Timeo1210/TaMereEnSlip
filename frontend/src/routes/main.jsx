import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';

class Main extends React.Component {

    render() {
        const { children } = this.props;
        return (
            <div className="container">
                <header>
                    <Header />
                </header>
                <main>
                    {children}
                </main>
                {/* Add footer here */}
            </div>
        );
    }

}

Main.propTypes = {
    children: PropTypes.element.isRequired,
};

export default Main;
