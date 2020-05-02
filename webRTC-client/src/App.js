import React from 'react';
import './App.css';
import Emitter from './service/emitter.js';
import { ESTABLISH_CONNECTION, START_LISTENING, SET_CHANNELS } from './service/events.js';
import HostConnection from './view/HostConnection.js';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: "",
            dataChannels: []
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount() {
        Emitter.emit(ESTABLISH_CONNECTION);
        Emitter.emit(START_LISTENING);
        Emitter.on(SET_CHANNELS, (channels) => {
            this.setState({ dataChannels: channels })
        });
    }

    handleInputChange = e => {
        this.setState({ input: e.target.value });
    }

    sendMessage = () => {
        let value = this.state.input;
        console.log("My message %s", value);
        this.state.dataChannels.forEach(channel => {
            channel.send(value);
        });
        this.setState({ input: "" });
    }

    render() {
        return (<div className="App">
            <div className="container">
                <h1>WebRTC Demo</h1>
                <input id="messageInput" type="text" className="form-control" placeholder="message" value={this.state.input} onChange={this.handleInputChange} />
                <button type="button" className="btn btn-primary" onClick={this.sendMessage}>SEND</button>
            </div>
            <HostConnection />
        </div>
        );
    }
}


export default App;