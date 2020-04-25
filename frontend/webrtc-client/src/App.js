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
        this.sendMess = this.sendMess.bind(this);
    }

    componentDidMount() {
        conn.onopen = () => {
            console.log("Connected to signalling server");
        }
        conn.onmessage = message => {
            console.log("[Connection OnMessage] : ", JSON.stringify(JSON.parse(message.data), null, 2));
            const data = JSON.parse(message.data);
            switch (data.eventType) {
                case INIT:
                    this.setState(pS => ({
                        ...pS,
                        currentId: data.id
                    }));
                    console.log("My Id is %s", this.state.currentId);
                    break;
                case PEER_CONNECTED:
                    this.makeOffer(data.id);
                    break;
                case MESSAGE:
                    this.handleMessage(data.payload);
                    break;
            }
        }
    }

    makeOffer(id) {
        let pc = this.getPeerConnection(id);
        pc.createOffer().then(function (offer) {
            console.log("Creating offer for ", id);
            pc.setLocalDescription(offer).then(() => {
                this.sendMess({
                    eventType: MESSAGE,
                    payload: {
                        by: this.state.currentId,
                        to: id,
                        type: payloadType.OFFER,
                        data: offer
                    }
                });
            });
        });
    }

    handleMessage(payload) {
        let pc = this.getPeerConnection(payload.by);
        let data = payload.data;
        switch (payload.type) {
            case "offer":
                pc.setRemoteDescription(new RTCSessionDescription(data));
                pc.createAnswer().then((answer) => {
                    pc.setLocalDescription(answer);
                    console.log("Sending answer to %s", payload.by);
                    this.sendMess({
                        eventType: MESSAGE,
                        payload: {
                            by: this.state.currentId,
                            to: payload.by,
                            type: payloadType.ANSWER,
                            data: answer
                        }
                    });
                });
                break;
            case "answer":
                pc.setRemoteDescription(new RTCSessionDescription(data));
                break;
            case "candidate":
                pc.addIceCandidate(new RTCIceCandidate(data));
                break;
        }
    }

    sendMess(message) {
        conn.send(JSON.stringify(message))
    }

    getPeerConnection(id) {
        let pc = this.state.peerConnections[id];
        if (pc == null) {
            pc = new RTCPeerConnection(null, {
                optional: [{
                    RtpDataChannels: true
                }]
            });
            this.setState(prevState => ({
                peerConnections: {
                    ...prevState.peerConnections,
                    ...pc
                },
                ...prevState
            }));
            pc.onicecandidate = function (event) {
                if (event.candidate) {
                    this.sendMess({
                        eventType: MESSAGE,
                        payload: {
                            by: this.state.currentId,
                            to: id,
                            type: payloadType.CANDIDATE,
                            data: event.candidate
                        }
                    });
                }
            };
            let dataChannel = pc.createDataChannel("dataChannel", {
                reliable: true
            });
            dataChannel.onmessage = function (event) {
                console.log("message from  %s : %s", id, event.data);
            }
            this.setState(prevState => ({
                dataChannels: {
                    ...prevState.dataChannels, dataChannel
                },
                ...prevState
            }));
        }
        return pc;
    }

    sendMessage(value) {
        console.log("My message %s", value);
        this.state.dataChannels.forEach(function (channel) {
            channel.send(value);
        });
        value = "";
    }

    render() {
        let value = document.getElementById("messageInput");
        return (<div className="App">
            <div className="container">
                <h1>WebRTC Demo</h1>
                <input id="messageInput" type="text" className="form-control" placeholder="message" />
                <button type="button" className="btn btn-primary" onClick={() => this.sendMessage(value)}>SEND</button>
            </div>
        </div>
        );
    }
}


export default App;