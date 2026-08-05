import { createServer } from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { initSocket } from "./lib/socket.js";

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(env.PORT, () => {
  logger.info(`Haritha Sahayak API listening on http://localhost:${env.PORT}`);
});
