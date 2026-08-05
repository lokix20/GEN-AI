import pg from "pg";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { logger } from "./logger.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl:
    env.DATABASE_URL.includes("supabase.co") || env.DATABASE_URL.includes("pooler.supabase.com")
      ? { rejectUnauthorized: false }
      : undefined,
  connectionTimeoutMillis: 2000,
});

let isPostgresAvailable: boolean | null = null;

// Initial pre-seeded mock database store for offline / non-docker environments
const passwordHash = bcrypt.hashSync("password123", 10);

const memoryUsers = new Map<string, any>([
  [
    "demo-farmer-id-123",
    {
      id: "demo-farmer-id-123",
      name: "Ramesh Farm",
      email: "demo.farmer@harithasahayak.in",
      phone: "9876543210",
      passwordHash,
      role: "FARMER",
      emailVerified: true,
      googleId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  [
    "demo-admin-id-456",
    {
      id: "demo-admin-id-456",
      name: "Admin User",
      email: "admin@harithasahayak.in",
      phone: "9999999999",
      passwordHash,
      role: "ADMIN",
      emailVerified: true,
      googleId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
]);

const memoryProfiles = new Map<string, any>([
  [
    "demo-farmer-id-123",
    {
      id: "demo-farmer-profile-123",
      userId: "demo-farmer-id-123",
      state: "Kerala",
      district: "Palakkad",
      village: "Vallapuzha",
      farmSizeAcres: 4.2,
      soilType: "Loamy",
      waterSource: "Rainfed",
      mainCrops: ["Rice", "Coconut"],
      preferredLanguage: "en",
      experienceYears: 12,
      onboarded: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
]);

const memoryVerificationTokens: any[] = [];
const memoryRefreshTokens: any[] = [];
const memoryChatSessions = new Map<string, any>();
const memoryChatMessages: any[] = [];
const memoryDiseaseReports: any[] = [];

async function executeMockQuery(text: string, params: any[] = []): Promise<any[]> {
  const normalized = text.replace(/\s+/g, " ").trim();

  // --- USER TABLE QUERIES ---
  if (normalized.includes('FROM "User" WHERE email = $1')) {
    const user = Array.from(memoryUsers.values()).find((u) => u.email.toLowerCase() === String(params[0]).toLowerCase());
    return user ? [user] : [];
  }

  if (normalized.includes('FROM "User" WHERE id = $1')) {
    const user = memoryUsers.get(params[0]);
    return user ? [user] : [];
  }

  if (normalized.includes('FROM "User" WHERE "googleId" = $1')) {
    const user = Array.from(memoryUsers.values()).find((u) => u.googleId === params[0]);
    return user ? [user] : [];
  }

  if (normalized.startsWith('INSERT INTO "User"')) {
    const [id, name, email, phoneOrGId, passHash, role] = params;
    const isGoogle = normalized.includes('"googleId"');
    const user = {
      id,
      name,
      email,
      phone: isGoogle ? null : params[3],
      googleId: isGoogle ? params[3] : null,
      passwordHash: isGoogle ? "" : params[4],
      role: isGoogle ? "FARMER" : role,
      emailVerified: isGoogle ? true : params[6] ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryUsers.set(id, user);
    return [user];
  }

  if (normalized.startsWith('UPDATE "User" SET "emailVerified" = true')) {
    const user = memoryUsers.get(params[0]);
    if (user) {
      user.emailVerified = true;
      user.updatedAt = new Date();
    }
    return user ? [user] : [];
  }

  if (normalized.startsWith('UPDATE "User" SET "passwordHash" = $2')) {
    const user = memoryUsers.get(params[0]);
    if (user) {
      user.passwordHash = params[1];
      user.updatedAt = new Date();
    }
    return user ? [user] : [];
  }

  if (normalized.startsWith('DELETE FROM "User" WHERE email = $1')) {
    for (const [id, u] of memoryUsers.entries()) {
      if (u.email === params[0]) memoryUsers.delete(id);
    }
    return [];
  }

  // --- FARMER PROFILE QUERIES ---
  if (normalized.includes('FROM "FarmerProfile" WHERE "userId" = $1')) {
    const profile = memoryProfiles.get(params[0]);
    return profile ? [profile] : [];
  }

  if (normalized.startsWith('INSERT INTO "FarmerProfile"')) {
    const [id, userId] = params;
    const profile = {
      id,
      userId,
      state: params[2] ?? null,
      district: params[3] ?? null,
      village: params[4] ?? null,
      farmSizeAcres: params[5] ?? null,
      soilType: params[6] ?? null,
      waterSource: params[7] ?? null,
      mainCrops: params[8] ?? [],
      preferredLanguage: params[9] ?? "en",
      experienceYears: params[10] ?? null,
      onboarded: params[11] ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryProfiles.set(userId, profile);
    return [profile];
  }

  if (normalized.startsWith('UPDATE "FarmerProfile"')) {
    const userId = params[0];
    const profile = memoryProfiles.get(userId) || { id: userId, userId, mainCrops: [], preferredLanguage: "en", onboarded: true };
    profile.onboarded = true;
    profile.updatedAt = new Date();
    memoryProfiles.set(userId, profile);
    return [profile];
  }

  // --- VERIFICATION TOKENS ---
  if (normalized.startsWith('INSERT INTO "VerificationToken"')) {
    const token = {
      id: params[0],
      userId: params[1],
      codeHash: params[2],
      purpose: params[3],
      expiresAt: params[4],
      consumedAt: null,
      createdAt: new Date(),
    };
    memoryVerificationTokens.push(token);
    return [token];
  }

  if (normalized.includes('FROM "VerificationToken"')) {
    const [userId, purpose] = params;
    const active = memoryVerificationTokens
      .filter((t) => t.userId === userId && t.purpose === purpose && !t.consumedAt && t.expiresAt > new Date())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return active[0] ? [active[0]] : [];
  }

  if (normalized.startsWith('UPDATE "VerificationToken" SET "consumedAt" = NOW()')) {
    const token = memoryVerificationTokens.find((t) => t.id === params[0]);
    if (token) token.consumedAt = new Date();
    return token ? [token] : [];
  }

  // --- REFRESH TOKENS ---
  if (normalized.startsWith('INSERT INTO "RefreshToken"')) {
    const token = {
      id: params[0],
      userId: params[1],
      tokenHash: params[2],
      expiresAt: params[3],
      revokedAt: null,
      createdAt: new Date(),
    };
    memoryRefreshTokens.push(token);
    return [token];
  }

  if (normalized.includes('FROM "RefreshToken"')) {
    const token = memoryRefreshTokens.find((t) => t.tokenHash === params[0] && !t.revokedAt && t.expiresAt > new Date());
    return token ? [token] : [];
  }

  if (normalized.startsWith('UPDATE "RefreshToken" SET "revokedAt" = NOW()')) {
    const token = memoryRefreshTokens.find((t) => t.tokenHash === params[0]);
    if (token) token.revokedAt = new Date();
    return token ? [token] : [];
  }

  // --- CHAT SESSIONS ---
  if (normalized.includes('FROM "ChatSession" WHERE "userId" = $1')) {
    const list = Array.from(memoryChatSessions.values()).filter((s) => s.userId === params[0]);
    return list.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  if (normalized.includes('FROM "ChatSession" WHERE id = $1')) {
    const session = memoryChatSessions.get(params[0]);
    return session ? [session] : [];
  }

  if (normalized.startsWith('INSERT INTO "ChatSession"')) {
    const session = {
      id: params[0],
      userId: params[1],
      title: params[2],
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryChatSessions.set(session.id, session);
    return [session];
  }

  if (normalized.startsWith('UPDATE "ChatSession"')) {
    const session = memoryChatSessions.get(params[0]);
    if (session) session.updatedAt = new Date();
    return session ? [session] : [];
  }

  if (normalized.startsWith('DELETE FROM "ChatSession"')) {
    const session = memoryChatSessions.get(params[0]);
    if (session) memoryChatSessions.delete(params[0]);
    return session ? [session] : [];
  }

  // --- CHAT MESSAGES ---
  if (normalized.includes('FROM "ChatMessage" WHERE "sessionId" = $1')) {
    const msgs = memoryChatMessages.filter((m) => m.sessionId === params[0]);
    return msgs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  if (normalized.startsWith('INSERT INTO "ChatMessage"')) {
    const msg = {
      id: params[0],
      sessionId: params[1],
      role: params[2],
      content: params[3],
      imageUrl: params[4] || null,
      createdAt: new Date(),
    };
    memoryChatMessages.push(msg);
    return [msg];
  }

  // --- DISEASE REPORTS ---
  if (normalized.startsWith('INSERT INTO "DiseaseReport"')) {
    const report = {
      id: params[0],
      userId: params[1],
      cropName: params[2],
      imageUrl: params[3],
      diseaseName: params[4],
      confidence: params[5],
      affectedArea: params[6],
      cause: params[7],
      organicSolution: params[8],
      chemicalSolution: params[9],
      preventionTips: params[10],
      createdAt: new Date(),
    };
    memoryDiseaseReports.push(report);
    return [report];
  }

  if (normalized.includes('FROM "DiseaseReport" WHERE "userId" = $1')) {
    const reports = memoryDiseaseReports.filter((r) => r.userId === params[0]);
    return reports.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  if (normalized.includes('FROM "DiseaseReport" WHERE id = $1')) {
    const report = memoryDiseaseReports.find((r) => r.id === params[0] && r.userId === params[1]);
    return report ? [report] : [];
  }

  return [];
}

export async function query(text: string, params?: any[]): Promise<any[]> {
  if (isPostgresAvailable === false) {
    return executeMockQuery(text, params);
  }

  try {
    const client = await pool.connect();
    try {
      if (isPostgresAvailable === null) {
        isPostgresAvailable = true;
        logger.info("Connected to PostgreSQL database successfully.");
      }
      const res = await client.query(text, params);
      return res.rows;
    } finally {
      client.release();
    }
  } catch (err: any) {
    // No `!== false` guard needed: the early return above means we only reach here while
    // isPostgresAvailable is true or null, so this still logs exactly once — on the first failure.
    isPostgresAvailable = false;
    logger.warn(
      `PostgreSQL unavailable (${err.code || err.message}). Switching to built-in in-memory fallback database for local development.`
    );
    return executeMockQuery(text, params);
  }
}

export async function queryOne(text: string, params?: any[]): Promise<any> {
  const rows = await query(text, params);
  return rows[0] || null;
}
