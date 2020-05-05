import Emitter from '../service/emitter.js';
import * as constants from '../service/events.js'
import React from 'react';
import ConnectionManager from './ConnectionManager.js';

class HostConnection extends React.Component {
    constructor(props) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
        this.listenMessage = this.listenMessage.bind(this);
        this.sendDetails = this.sendDetails.bind(this);
    }

    componentDidMount() {
        Emitter.on(constants.ESTABLISH_CONNECTION, (userId, roomId) => {
            constants.conn.onopen = () => {
                console.log("Connected to Server");
                //sendDetails(roomId, userId);
            }
        });
        Emitter.on(constants.START_LISTENING, () => {
            constants.conn.onmessage = (message) => {
                this.listenMessage(message);
            }
        });
        Emitter.on(constants.REPLY_TO_SERVER, (message) => {
            this.sendMessage(message);
        });
    }

    listenMessage = message => {
        const data = JSON.parse(message.data);
        switch (data.eventType) {
            case constants.INIT:
                Emitter.emit(constants.INIT, data);
                break;
            case constants.PEER_CONNECTED:
                Emitter.emit(constants.PEER_CONNECTED, data);
                break;
            case constants.MESSAGE:
                Emitter.emit(constants.MESSAGE, data);
                break;
            default: console.log("Not a valid case");
        }
    }

    sendMessage = message => {
        constants.conn.send(JSON.stringify(message));
    }

    sendDetails = (roomId, userId) => {
        let message = {
            eventType: constants.GET_ROOM,
            payload: {
                roomId: roomId,
                userId: userId
            }
        };
        console.log("Sending Payload", JSON.stringify(message));
        this.sendMessage(message);
    }

    render() {
        return (<ConnectionManager />);
    }
}

export default HostConnection;