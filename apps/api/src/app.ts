import path from "node:path";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { authRoutes } from "./modules/auth/routes.js";
import { chatRoutes } from "./modules/chat/routes.js";
import { diseaseDetectionRoutes } from "./modules/disease-detection/routes.js";
import { uploadsRoutes } from "./modules/uploads/routes.js";
import { usersRoutes } from "./modules/users/routes.js";
import { marketRoutes } from "./modules/market/routes.js";
import { weatherRoutes } from "./modules/weather/routes.js";

export const app = express();

app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
if (env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/disease-detection", diseaseDetectionRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/market-prices", marketRoutes);
app.use("/api/weather", weatherRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
