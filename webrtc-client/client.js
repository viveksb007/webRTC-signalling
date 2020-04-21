const conn = new WebSocket("ws://localhost:8080/socket");
const MESSAGE = "MESSAGE";
const INIT = "INIT";
const PEER_CONNECTED = "PEER.CONNECTED";
const payloadType = {
    OFFER: "offer",
    ANSWER: "answer",
    CANDIDATE: "candidate"
}

conn.onopen = function () {
    console.log("Connected to signalling server");
}

conn.onmessage = function (message) {
    console.log("[Connection OnMessage] : ", JSON.stringify(JSON.parse(message.data), null, 2));
    const data = JSON.parse(message.data);
    switch (data.eventType) {
        case INIT:
            currentId = data.id;
            console.log("My Id is %s", currentId);
            break;
        case PEER_CONNECTED:
            makeOffer(data.id);
            break;
        case MESSAGE:
            handleMessage(data.payload);
            break;
    }
}

function send(message) {
    conn.send(JSON.stringify(message))
}

let peerConnections = {}
let dataChannels = []
let currentId;

function getPeerConnection(id) {
    if (peerConnections[id])
        return peerConnections[id];
    let pc = new RTCPeerConnection();
    peerConnections[id] = pc;
    pc.onicecandidate = function (event) {
        if (event.candidate) {
            send({
                eventType: MESSAGE,
                payload: {
                    by: currentId,
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
    dataChannels.push(dataChannel);
    return pc;
}

function makeOffer(id) {
    let pc = getPeerConnection(id);
    pc.createOffer(function (offer) {
        console.log("Creating offer for ", id);
        send({
            eventType: MESSAGE,
            payload: {
                by: currentId,
                to: id,
                type: payloadType.OFFER,
                data: offer
            }
        });
        pc.setLocalDescription(offer);
    }, function (error) {
        console.log("error :", error);
    });
}

function handleMessage(payload) {
    let pc = getPeerConnection(payload.by);
    let data = payload.data;
    switch (payload.type) {
        case "offer":
            pc.setRemoteDescription(new RTCSessionDescription(data));
            pc.createAnswer(function (answer) {
                pc.setLocalDescription(answer);
                console.log("Sending answer to %s", payload.by);
                send({
                    eventType: MESSAGE,
                    payload: {
                        by: currentId,
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