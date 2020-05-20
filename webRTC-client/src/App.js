import React from 'react';
import './App.css';
import {Container} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/core/styles';
import {theme} from './styles.js';

import ChatBox from './components/ChatBox.js';
import VideoChat from './components/VideoChat';
import Emitter from './service/emitter.js';
import {ESTABLISH_CONNECTION, START_LISTENING} from './service/events.js';
import HostConnection from './view/HostConnection.js';

class App extends React.Component {

    componentDidMount() {
        Emitter.emit(ESTABLISH_CONNECTION);
        Emitter.emit(START_LISTENING);
    }

    render() {
        return (
            <div className="App">
                <ThemeProvider theme={theme}>
                    <Container maxWidth="xl">
                        <h1>Chat Room</h1>
                        <ChatBox />
                        <div style={{ marginTop: '10px', marginBottom: '10px' }}/>
                        <VideoChat />
                    </Container>
                </ThemeProvider>
                <HostConnection />
            </div>
        );
    }
}

export default App;