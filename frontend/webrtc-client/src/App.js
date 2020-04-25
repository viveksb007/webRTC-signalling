import React from 'react';
import './App.css';
import { conn, MESSAGE, INIT, PEER_CONNECTED, payloadType } from './constants.js';

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            peerConnections: {},
            dataChannels: [],
            currentId: null
        }
    }

    componentDidMount() {
        conn.onopen = function () {
            console.log("Connected to signalling server");
        }
    }

    render() {
        return (<div className="App">
            <div className="container">
                <h1>WebRTC Demo</h1>
                <input id="messageInput" type="text" className="form-control" placeholder="message" />
                <button type="button" className="btn btn-primary" onClick="sendMessage()">SEND</button>
            </div>
        </div>
        );
    }
}

export default App;