import { WebSocket, WebSocketServer } from "ws";
import { Server as HttpServer } from "http";
import type { Match } from "../database/schema";
import { EVENTS } from "../utils/events.enums";

interface SendJsonOptions {
  webSocket: WebSocket;
  payload: Record<string, any>;
}

// ============== Sends a JSON message through a WebSocket connection ================
function sendJson({ webSocket, payload }: SendJsonOptions) {
  if (webSocket.readyState !== WebSocket.OPEN) {
    console.error("Socket is not open. Cannot send message.");
    return;
  }

  webSocket.send(JSON.stringify(payload));
}

interface BroadcastOptions {
  webSocketServer: WebSocketServer;
  payload: Record<string, any>;
}

// ======== Broadcasts a JSON message to all connected clients of a WebSocket server ============
function broadcast({ webSocketServer, payload }: BroadcastOptions) {
  for (const client of webSocketServer.clients) {
    if (client.readyState !== WebSocket.OPEN) {
      console.error("Client socket is not open. Cannot send message.");
      return;
    }

    client.send(JSON.stringify(payload));
  }
}

// ================= Attaches a WebSocket server to an existing HTTP server =================
export function attachWebSocketServer(httpServer: HttpServer) {
  const webSocketServer = new WebSocketServer({
    server: httpServer,
    path: "/ws",
    maxPayload: 1024 * 1024, // 1 MB payload size limit
  });

  webSocketServer.on("connection", (webSocket) => {
    sendJson({
      webSocket,
      payload: { message: "Welcome to the WebSocket server!" },
    });

    webSocket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  function broadcastMatchCreated(match: Match) {
    broadcast({
      webSocketServer,
      payload: { event: EVENTS.MATCH_CREATED, match },
    });
  }

  return { broadcastMatchCreated };
}
