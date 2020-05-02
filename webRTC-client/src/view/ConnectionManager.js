import Emitter from '../service/emitter.js';
import { payloadType, MESSAGE, INIT, PEER_CONNECTED, REPLY_TO_SERVER, SESSION_ID, SET_CHANNELS } from '../service/events.js'
import React from 'react';

class ConnectionManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            peerConnections: {},
            dataChannels: [],
            currentId: ""
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
        if (peer[id] == null) {
            const p = this.createNewPeerAndChannel(id);
            return p;
        } else return peer[id];
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
            console.log("message from  %s : %s", id, event.data);
        }

        this.setState({
            ...this.state,
            peerConnections: { ...this.state.peerConnections, [id]: pc },
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
                    }, () => { console.log("Successfully added candidate %s", id); });
                });
                break;
        }
    }

    render() {
        return null;
    }
}

export default ConnectionManager;