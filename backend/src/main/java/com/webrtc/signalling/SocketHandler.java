package com.webrtc.signalling;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Component
public class SocketHandler extends TextWebSocketHandler {

    public static final Logger logger = LoggerFactory.getLogger(SocketHandler.class);
    private static final int sendTimeLimit = (int) TimeUnit.SECONDS.toMillis(10);
    private static final int bufferSizeLimit = 10 * 1024;

    private final Map<String, ConcurrentWebSocketSessionDecorator> sessionMap = new ConcurrentHashMap<>();
    private final Gson gson = new Gson();

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        JsonObject payload = gson.fromJson(message.getPayload(), JsonObject.class);
        JsonObject data = payload.getAsJsonObject("payload");
        String targetSessionId = data.get("to").getAsString();
        if (sessionMap.containsKey(targetSessionId)) {
            sessionMap.get(targetSessionId).sendMessage(message);
            logger.info("Sent message from {} to {}", session.getId(), targetSessionId);
        } else {
            logger.error("Can't find {} in session map", targetSessionId);
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String sessionId = session.getId();
        ConcurrentWebSocketSessionDecorator sessionDecorator = new ConcurrentWebSocketSessionDecorator(session, sendTimeLimit, bufferSizeLimit);
        sessionMap.put(sessionId, sessionDecorator);
        JsonObject identityObject = new JsonObject();
        identityObject.addProperty("eventType", "INIT");
        identityObject.addProperty("id", sessionId);
        session.sendMessage(new TextMessage(identityObject.toString()));
        JsonObject response = new JsonObject();
        response.addProperty("eventType", "PEER.CONNECTED");
        response.addProperty("id", sessionId);
        TextMessage responseMessage = new TextMessage(response.toString());
        for (Map.Entry<String, ConcurrentWebSocketSessionDecorator> entry : sessionMap.entrySet()) {
            if (!entry.getValue().getId().equals(sessionId)) {
                entry.getValue().sendMessage(responseMessage);
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessionMap.remove(session.getId());
        JsonObject removeClient = new JsonObject();
        removeClient.addProperty("eventType", "PEER.DISCONNECT");
        removeClient.addProperty("id", session.getId());
        for (WebSocketSession s : sessionMap.values()) {
            s.sendMessage(new TextMessage(removeClient.toString()));
        }
    }
}
