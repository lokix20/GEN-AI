import { randomUUID } from "node:crypto";
import { query, queryOne } from "../../lib/db.js";

export async function listSessions(userId: string): Promise<any[]> {
  const sessions = await query(
    `SELECT * FROM "ChatSession"
     WHERE "userId" = $1
     ORDER BY "isPinned" DESC, "updatedAt" DESC`,
    [userId]
  );

  // Attach the latest message for each session
  for (const session of sessions) {
    const latestMessage = await queryOne(
      `SELECT * FROM "ChatMessage"
       WHERE "sessionId" = $1
       ORDER BY "createdAt" DESC
       LIMIT 1`,
      [session.id]
    );
    session.messages = latestMessage ? [latestMessage] : [];
  }

  return sessions;
}

export async function findSession(userId: string, sessionId: string): Promise<any> {
  return queryOne(
    `SELECT * FROM "ChatSession" WHERE id = $1 AND "userId" = $2`,
    [sessionId, userId]
  );
}

export async function createSession(userId: string, title: string): Promise<any> {
  const id = randomUUID();
  return queryOne(
    `INSERT INTO "ChatSession" (id, "userId", title, "isPinned", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, false, NOW(), NOW())
     RETURNING *`,
    [id, userId, title]
  );
}

export async function touchSession(sessionId: string): Promise<any> {
  return queryOne(
    `UPDATE "ChatSession" SET "updatedAt" = NOW() WHERE id = $1 RETURNING *`,
    [sessionId]
  );
}

export async function updateSession(sessionId: string, data: { title?: string; isPinned?: boolean }): Promise<any> {
  const keys = Object.keys(data);
  if (keys.length === 0) {
    return queryOne(`SELECT * FROM "ChatSession" WHERE id = $1`, [sessionId]);
  }

  const setClause = keys.map((key, i) => `"${key}" = $${i + 2}`).join(", ");
  const values = Object.values(data);

  return queryOne(
    `UPDATE "ChatSession" SET ${setClause}, "updatedAt" = NOW() WHERE id = $1 RETURNING *`,
    [sessionId, ...values]
  );
}

export async function deleteSession(sessionId: string): Promise<any> {
  return queryOne(
    `DELETE FROM "ChatSession" WHERE id = $1 RETURNING *`,
    [sessionId]
  );
}

export async function listMessages(sessionId: string): Promise<any[]> {
  return query(
    `SELECT * FROM "ChatMessage" WHERE "sessionId" = $1 ORDER BY "createdAt" ASC`,
    [sessionId]
  );
}

export async function createMessage(input: { sessionId: string; role: "user" | "assistant"; content: string; imageUrl?: string | null }): Promise<any> {
  const id = randomUUID();
  return queryOne(
    `INSERT INTO "ChatMessage" (id, "sessionId", role, content, "imageUrl", "createdAt")
     VALUES ($1, $2, $3, $4, $5, NOW())
     RETURNING *`,
    [id, input.sessionId, input.role, input.content, input.imageUrl || null]
  );
}
