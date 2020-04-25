const socketConnection = function () {
    const host = window.location.host;
    const protocol = window.location.protocol;
    export const conn = new WebSocket(("https:" === protocol ? "wss://" + host : "ws://localhost:8080") + "/socket");
    conn.onopen = function () {
        console.log("Connected to signalling server");
    };

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
    };
}