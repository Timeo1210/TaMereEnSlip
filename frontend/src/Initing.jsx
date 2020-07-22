import React from 'react';
import {
    CircularProgress
} from '@material-ui/core';

import axios from 'axios';
import { config } from './config';

class Initing extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            serverIsOnline: false
        }
    }

    getNewServerIp() {
        axios({
            method: 'GET',
            url: `${config.BACKUP_ENDPOINT}/ip`,
            timeout: 2500,
        }).then((data) => {
            config.setValue({
                ENDPOINT: `http://${data.data.ip}`
            });
            this.checkIfServerIsOnline()
            .then(() => {
                this.setState({
                    loading: false,
                    serverIsOnline: true
                });
            }).catch((error) => {
                console.log(error);
                this.setState({
                    loading: false
                });
            });
        }).catch((error) => {
            console.log(error);
            this.setState({
                loading: false
            });
        })
    }

    checkIfServerIsOnline() {
        return axios({
            method: 'GET',
            url: `${config.ENDPOINT}/status`,
            timeout: 1000
        });
    }

    componentDidMount() {
        //REQ
        this.checkIfServerIsOnline()
        .then(() => {
            this.setState({
                loading: false,
                serverIsOnline: true
            });
        }).catch(() => {
            //get new url
            this.getNewServerIp()
        })
    }


    render() {
        const { loading, serverIsOnline } = this.state;
        if (loading) {
            return (
                <div style={styles.container}>
                    <CircularProgress />
                </div>
            );
        } else if (serverIsOnline) {
            return (
                <>
                    {this.props.children}
                </>
            )
        } else {
            return (
                <div style={styles.container}>
                    <h1 style={styles.container.title}>Le site est en maintenance</h1>
                </div>
            )
        }
    }
}

const styles = {
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        title: {
            color: '#000'
        }
    }
}

export default Initing;