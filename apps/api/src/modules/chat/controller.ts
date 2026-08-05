import type { Request, Response } from "express";
import { SendMessageSchema } from "@haritha/shared-types";
import * as chatService from "./service.js";

function sseWrite(res: Response, event: string, data: unknown) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

export async function listSessions(req: Request, res: Response) {
  const sessions = await chatService.listSessions(req.auth!.userId);
  res.json({ sessions });
}

export async function listMessages(req: Request, res: Response) {
  const messages = await chatService.listMessages(req.auth!.userId, req.params.sessionId);
  res.json({ messages });
}

export async function updateSession(req: Request, res: Response) {
  const { title, isPinned } = req.body ?? {};
  const session = await chatService.updateSession(req.auth!.userId, req.params.sessionId, { title, isPinned });
  res.json({ session });
}

export async function deleteSession(req: Request, res: Response) {
  await chatService.deleteSession(req.auth!.userId, req.params.sessionId);
  res.status(204).send();
}

export async function streamReply(req: Request, res: Response) {
  const input = SendMessageSchema.parse(req.body);
  const reply = await chatService.startReply(req.auth!.userId, input);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  sseWrite(res, "init", { session: reply.session, userMessage: reply.userMessage });

  let fullText = "";
  let clientDisconnected = false;
  req.on("close", () => {
    clientDisconnected = true;
  });

  try {
    for await (const chunk of reply.chunks) {
      if (clientDisconnected) break;
      fullText += chunk;
      sseWrite(res, "chunk", { delta: chunk });
    }
  } catch (err) {
    sseWrite(res, "error", { message: err instanceof Error ? err.message : "AI provider error" });
    res.end();
    return;
  }

  if (!clientDisconnected) {
    const assistantMessage = await reply.onComplete(fullText);
    sseWrite(res, "done", { message: assistantMessage });
    res.end();
  } else if (fullText) {
    await reply.onComplete(fullText);
  }
}
