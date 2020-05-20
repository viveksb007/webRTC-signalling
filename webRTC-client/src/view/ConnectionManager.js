import Emitter from '../service/emitter.js';
import {
    ADD_LOCAL_STREAM,
    INIT,
    MESSAGE,
    MESSAGE_RECEIVED,
    payloadType,
    PEER_CONNECTED,
    REPLY_TO_SERVER,
    SET_CHANNELS
} from '../service/events.js'
import React from 'react';

class ConnectionManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            peerConnections: new Map(),
            dataChannels: [],
            currentId: "",
            stream: null
        };
        this.handleMessage = this.handleMessage.bind(this);
        this.makeOffer = this.makeOffer.bind(this);
        this.getPeerConnection = this.getPeerConnection.bind(this);
        this.createNewPeerAndChannel = this.createNewPeerAndChannel.bind(this);
    }

    componentDidMount() {
        Emitter.on(INIT, data => {
            this.setState({
                currentId: data.id
            }, () => {
                console.log("My id is %s", this.state.currentId);
                //Emitter.emit(SESSION_ID, this.state.currentId);
            });
        });
        Emitter.on(PEER_CONNECTED, data => this.makeOffer(data.id));
        Emitter.on(MESSAGE, data => this.handleMessage(data.payload));
        Emitter.on(ADD_LOCAL_STREAM, stream => {
            this.setState({
                stream: stream
            });
        });
    }

    makeOffer = id => {
        const pc = this.getPeerConnection(id);
        pc.createOffer().then(offer => {
            console.log("Creating Offer for %s", id);
            pc.setLocalDescription(offer).then(() => {
                const data = {
                    eventType: MESSAGE,
                    payload: {
                        by: this.state.currentId,
                        to: id,
                        type: payloadType.OFFER,
                        data: offer
                    }
                }
                Emitter.emit(REPLY_TO_SERVER, data);
            });
        });
    }

    getPeerConnection = id => {
        let peer = this.state.peerConnections;
        if (!peer.has(id)) {
            return this.createNewPeerAndChannel(id);
        } else return peer.get(id);
    }

    createNewPeerAndChannel = (id) => {
        const configuration = {
            'iceServers': [{
                'urls': 'stun:stun.l.google.com:19302'
            }]
        };
        const pc = new RTCPeerConnection(configuration, {
            optional: [{
                RtpDataChannels: true
            }]
        });
        pc.onicecandidate = event => {
            if (event.candidate) {
                const data = {
                    eventType: MESSAGE,
                    payload: {
                        by: this.state.currentId,
                        to: id,
                        type: payloadType.CANDIDATE,
                        data: event.candidate
                    }
                }
                Emitter.emit(REPLY_TO_SERVER, data);
            }
        };
        const dataChannel = pc.createDataChannel("dataChannel", {
            reliable: true
        });
        dataChannel.onmessage = event => {
            const payload = {
                user: id,
                message: event.data
            }
            Emitter.emit(MESSAGE_RECEIVED, payload);
            //console.log("message from  %s : %s", id, event.data);
        }
        let peer = this.state.peerConnections;
        peer.set(id, pc);
        this.setState({
            ...this.state,
            peerConnections: peer,
            dataChannels: [...this.state.dataChannels, dataChannel]
        }, () => {
            Emitter.emit(SET_CHANNELS, this.state.dataChannels);
        });
        return pc;
    }

    handleMessage = payload => {
        const id = payload.by;
        const pc = this.getPeerConnection(id);
        const data = payload.data;
        const peer = this.state.peerConnections;
        switch (payload.type) {
            case "offer":
                pc.setRemoteDescription(new RTCSessionDescription(data));
                pc.createAnswer().then(answer => {
                    pc.setLocalDescription(answer);
                    peer[id] = pc;
                    this.setState({
                        peerConnections: peer
                    });
                    console.log("Sending answer to %s", id);
                    const ans = {
                        eventType: MESSAGE,
                        payload: {
                            by: this.state.currentId,
                            to: id,
                            type: payloadType.ANSWER,
                            data: answer
                        }
                    }
                    Emitter.emit(REPLY_TO_SERVER, ans);
                });
                break;
            case "answer":
                pc.setRemoteDescription(new RTCSessionDescription(data)).then(() => {
                    peer[id] = pc;
                    this.setState({
                        peerConnections: peer
                    });
                });
                break;
            case "candidate":
                pc.addIceCandidate(new RTCIceCandidate(data)).then(() => {
                    peer[id] = pc;
                    this.setState({
                        peerConnections: peer
                    }, () => {
                        console.log("Successfully added candidate %s", id);
                    });
                });
                break;
            default:
                console.log("Not a valid case");
        }
    }

    render() {
        return null;
    }
}

export default ConnectionManager;