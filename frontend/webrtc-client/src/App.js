import React from 'react';
import './App.css';

class App extends React.Component {
    componentDidMount() {

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