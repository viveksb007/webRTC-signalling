const host = window.location.host;
const protocol = window.location.protocol;
export const conn = new WebSocket(("https:" === protocol ? "wss://" : "ws://") + host + "/socket");

export const MESSAGE = "MESSAGE";
export const INIT = "INIT";
export const PEER_CONNECTED = "PEER.CONNECTED";
export const ESTABLISH_CONNECTION = "ESTABLISH_CONNECTION";
export const REPLY_TO_SERVER = "REPLY_TO_SERVER";
export const START_LISTENING = "START_LISTENING";
export const SESSION_ID = "SESSION_ID";
export const SET_CHANNELS = "SET_CHANNELS";
export const GET_ROOM = "GET_ROOM";

export const payloadType = {
    OFFER: "offer",
    ANSWER: "answer",
    CANDIDATE: "candidate"
}