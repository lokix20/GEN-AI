type Level = "info" | "warn" | "error" | "debug";

function line(level: Level, message: string, meta?: unknown) {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  if (meta !== undefined) {
    console.log(base, meta);
  } else {
    console.log(base);
  }
}

export const logger = {
  info: (message: string, meta?: unknown) => line("info", message, meta),
  warn: (message: string, meta?: unknown) => line("warn", message, meta),
  error: (message: string, meta?: unknown) => line("error", message, meta),
  debug: (message: string, meta?: unknown) => {
    if (process.env.NODE_ENV !== "production") line("debug", message, meta);
  },
};
