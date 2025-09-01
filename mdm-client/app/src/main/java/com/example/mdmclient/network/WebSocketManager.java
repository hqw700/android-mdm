package com.example.mdmclient.network;

import android.util.Log;

import org.jetbrains.annotations.NotNull;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.ByteString;

public class WebSocketManager {

    private static final String TAG = "WebSocketManager";
    private WebSocket webSocket;
    private OkHttpClient client;
    private String wsUrl;
    private WebSocketListener listener;

    public WebSocketManager(String url, WebSocketListener listener) {
        this.wsUrl = url;
        this.listener = listener;
        client = new OkHttpClient.Builder().build();
    }

    public void start() {
        Request request = new Request.Builder().url(wsUrl).build();
        webSocket = client.newWebSocket(request, listener);
    }

    public void stop() {
        if (webSocket != null) {
            webSocket.close(1000, "Goodbye");
        }
    }

    public void sendMessage(String message) {
        if (webSocket != null) {
            Log.i(TAG, "sendMessage to server: " + message.toString());
            webSocket.send(message);
        }
    }
}
