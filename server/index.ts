import express, { type Application, type Response } from "express";
import matchesRouter from "./src/routes/matches.routes";
import { attachWebSocketServer } from "./src/sockets/server";
import http, { type Server as HttpServer } from "http";

const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || "0.0.0.0";

const app: Application = express(); // Express application instance

// HTTP Server instance created from the Express app, allowing us to attach a WebSocket server to it
const httpServer = http.createServer(app);

app.use(express.json());

app.use("/matches", matchesRouter);

const { broadcastMatchCreated } = attachWebSocketServer(httpServer);

// Make the broadcast function available in the app's locals so it can be accessed in route handlers
app.locals.broadcastMatchCreated = broadcastMatchCreated;

httpServer.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server is running at ${baseUrl}`);
  console.log(
    `WebSocket server is running at ${baseUrl.replace("http", "ws")}/ws`,
  );
});
