import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "../config/env.js";

export let io: Server | undefined;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: { origin: env.WEB_ORIGIN, credentials: true },
  });

  io.on("connection", (socket) => {
    socket.on("disconnect", () => undefined);
  });

  return io;
}
