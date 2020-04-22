const host = window.location.host;
const protocol = window.location.protocol;
const conn = new WebSocket(("https:" === protocol ? "wss://" : "ws://") + host + "/socket");
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
    let pc = new RTCPeerConnection(null, {
        optional: [{
            RtpDataChannels: true
        }]
    });
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
    pc.createOffer().then(function (offer) {
        console.log("Creating offer for ", id);
        pc.setLocalDescription(offer).then(() => {
            send({
                eventType: MESSAGE,
                payload: {
                    by: currentId,
                    to: id,
                    type: payloadType.OFFER,
                    data: offer
                }
            });
        });
    });
}

function handleMessage(payload) {
    let pc = getPeerConnection(payload.by);
    let data = payload.data;
    switch (payload.type) {
        case "offer":
            pc.setRemoteDescription(new RTCSessionDescription(data));
            pc.createAnswer().then((answer) => {
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

let input = document.getElementById("messageInput");

function sendMessage() {
    console.log("My message %s", input.value);
    dataChannels.forEach(function (channel) {
        channel.send(input.value);
    });
    input.value = "";
}