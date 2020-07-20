import React from 'react';

import styles from './Header.module.css';
import TwitterLogo from '../../assets/twitter.svg';
import GithubLogo from '../../assets/github.svg';

class Header extends React.Component {
    
    handleLogOut() {
        localStorage.clear();
        window.location.replace("/");
    }

    render() {
        return (
            <div className={styles.wrapper}>
                <section className={styles.section}>
                    <div className={styles.creator}>
                        <span>Créé par Timeo1210</span>
                    </div>
                    <span>•</span>
                    <div className={styles.social}>
                        <a href="https://twitter.com/TimeoBoulhol" className={styles.socialLink}>
                            <img src={TwitterLogo} alt=""/>
                        </a>
                        <a href="https://github.com/Timeo1210" className={styles.socialLink}>
                            <img src={GithubLogo} alt=""/>
                        </a>
                    </div>
                    <div onClick={this.handleLogOut} className={styles.logout}>
                        <span>Se Déconnecter</span>
                    </div>
                </section>
                <div className={styles.title}>
                    <h1>Ta Mère En Slip</h1>
                </div>
            </div>
        )
    }

}

export default Header;