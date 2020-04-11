var conn = new WebSocket("ws://localhost:8080/socket");

conn.onopen = function () {
    console.log("Connected to signalling server");
    initialize();
}

conn.onmessage = function (message) {
    console.log("Got message " + message.data);
    const content = JSON.parse(message.data);
    const event = content.event;
    const data = content.data;
    switch (event) {
        case "offer":
            handleOffer(data);
            break;
        case "answer":
            handleAnswer(data);
            break;
        case "candidate":
            handleCandidate(data);
            break;
        default:
            break;
    }
}

function send(message) {
    conn.send(JSON.stringify(message))
}

var peerConnection;
var dataChannel;
var input = document.getElementById("messageInput");

function initialize() {
    peerConnection = new RTCPeerConnection(null, {
        optional: [{
            RtpDataChannels: true
        }]
    });

    peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
            send({
                event: "candidate",
                data: event.candidate
            });
        }
    };

    dataChannel = peerConnection.createDataChannel("dataChannel", {
        reliable: true
    });

    dataChannel.onerror = function (error) {
        console.log("Error occurred on datachannel:", error);
    };

    dataChannel.onmessage = function (event) {
        console.log("message:", event.data);
    };

    dataChannel.onclose = function () {
        console.log("data channel is closed");
    };
}

function createOffer() {
    peerConnection.createOffer(function (offer) {
        send({
            event: "offer",
            data: offer
        });
        peerConnection.setLocalDescription(offer);
    }, function (error) {
        alert("Error in creating offer " + error);
    });
}

function handleOffer(offer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    peerConnection.createAnswer(function (answer) {
        peerConnection.setLocalDescription(answer);
        send({
            event: "answer",
            data: answer
        });
    }, function (error) {
        alert("Error creating answer " + error);
    });
}

function handleCandidate(candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

function handleAnswer(answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("connection established successfully!!");
}

function sendMessage() {
    console.log(input.value);
    dataChannel.send(input.value);
    input.value = "";
}