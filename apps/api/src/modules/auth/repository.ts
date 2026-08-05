import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import type { Role, VerificationPurpose } from "../../types/database.js";
import { query, queryOne } from "../../lib/db.js";

// Pre-seeded fallback mock users for zero-dependency local dev
const MOCK_PASSWORD_HASH = bcrypt.hashSync("password123", 10);

const MOCK_USERS: Record<string, any> = {
  "demo.farmer@harithasahayak.in": {
    id: "farmer-demo-id",
    name: "Ramesh Farm",
    email: "demo.farmer@harithasahayak.in",
    phone: "9876543210",
    passwordHash: MOCK_PASSWORD_HASH,
    role: "FARMER",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    farmerProfile: {
      id: "profile-demo-id",
      userId: "farmer-demo-id",
      state: "Andhra Pradesh",
      district: "Kadapa",
      village: "Vallapuzha",
      farmSizeAcres: 4.2,
      soilType: "Loamy",
      waterSource: "Rainfed",
      mainCrops: ["Paddy", "Tomato"],
      preferredLanguage: "te",
      experienceYears: 12,
      onboarded: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  "admin@harithasahayak.in": {
    id: "admin-demo-id",
    name: "Admin User",
    email: "admin@harithasahayak.in",
    phone: "9999999999",
    passwordHash: MOCK_PASSWORD_HASH,
    role: "ADMIN",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    farmerProfile: null,
  },
};

const MOCK_TOKENS: any[] = [];
const MOCK_REFRESH_TOKENS: any[] = [];

export async function findUserByEmail(email: string): Promise<any> {
  try {
    return await queryOne(`SELECT * FROM "User" WHERE email = $1`, [email]);
  } catch (err) {
    return MOCK_USERS[email.toLowerCase()] || null;
  }
}

export async function findUserById(id: string): Promise<any> {
  try {
    const user = await queryOne(`SELECT * FROM "User" WHERE id = $1`, [id]);
    if (!user) return null;

    const profile = await queryOne(`SELECT * FROM "FarmerProfile" WHERE "userId" = $1`, [id]);
    user.farmerProfile = profile;
    return user;
  } catch (err) {
    const mockUser = Object.values(MOCK_USERS).find((u) => u.id === id);
    return mockUser || null;
  }
}

export async function findUserByGoogleId(googleId: string): Promise<any> {
  try {
    return await queryOne(`SELECT * FROM "User" WHERE "googleId" = $1`, [googleId]);
  } catch (err) {
    return Object.values(MOCK_USERS).find((u) => u.googleId === googleId) || null;
  }
}

export async function createUser(input: { name: string; email: string; phone: string; passwordHash: string; role: Role }): Promise<any> {
  const userId = randomUUID();
  try {
    const user = await queryOne(
      `INSERT INTO "User" (id, name, email, phone, "passwordHash", role, "emailVerified", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, false, NOW(), NOW())
       RETURNING *`,
      [userId, input.name, input.email, input.phone, input.passwordHash, input.role]
    );

    if (input.role === "FARMER") {
      const profileId = randomUUID();
      await query(
        `INSERT INTO "FarmerProfile" (id, "userId", "mainCrops", "preferredLanguage", onboarded, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, false, NOW(), NOW())`,
        [profileId, userId, [], "en"]
      );
    }
    return user;
  } catch (err) {
    const newUser = {
      id: userId,
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone,
      passwordHash: input.passwordHash,
      role: input.role,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      farmerProfile: input.role === "FARMER" ? { id: randomUUID(), userId, mainCrops: [], preferredLanguage: "en", onboarded: false } : null,
    };
    MOCK_USERS[input.email.toLowerCase()] = newUser;
    return newUser;
  }
}

export async function createGoogleUser(input: { name: string; email: string; googleId: string }): Promise<any> {
  const userId = randomUUID();
  try {
    const user = await queryOne(
      `INSERT INTO "User" (id, name, email, "googleId", "passwordHash", "emailVerified", role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, '', true, 'FARMER', NOW(), NOW())
       RETURNING *`,
      [userId, input.name, input.email, input.googleId]
    );

    const profileId = randomUUID();
    await query(
      `INSERT INTO "FarmerProfile" (id, "userId", "mainCrops", "preferredLanguage", onboarded, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, false, NOW(), NOW())`,
      [profileId, userId, [], "en"]
    );
    return user;
  } catch (err) {
    const newUser = {
      id: userId,
      name: input.name,
      email: input.email.toLowerCase(),
      googleId: input.googleId,
      passwordHash: "",
      emailVerified: true,
      role: "FARMER",
      createdAt: new Date(),
      updatedAt: new Date(),
      farmerProfile: { id: randomUUID(), userId, mainCrops: [], preferredLanguage: "en", onboarded: false },
    };
    MOCK_USERS[input.email.toLowerCase()] = newUser;
    return newUser;
  }
}

export async function markEmailVerified(userId: string): Promise<any> {
  try {
    return await queryOne(
      `UPDATE "User" SET "emailVerified" = true, "updatedAt" = NOW() WHERE id = $1 RETURNING *`,
      [userId]
    );
  } catch (err) {
    const mockUser = Object.values(MOCK_USERS).find((u) => u.id === userId);
    if (mockUser) mockUser.emailVerified = true;
    return mockUser || null;
  }
}

export async function updatePasswordHash(userId: string, passwordHash: string): Promise<any> {
  try {
    return await queryOne(
      `UPDATE "User" SET "passwordHash" = $2, "updatedAt" = NOW() WHERE id = $1 RETURNING *`,
      [userId, passwordHash]
    );
  } catch (err) {
    const mockUser = Object.values(MOCK_USERS).find((u) => u.id === userId);
    if (mockUser) mockUser.passwordHash = passwordHash;
    return mockUser || null;
  }
}

export async function createVerificationToken(input: { userId: string; codeHash: string; purpose: VerificationPurpose; expiresAt: Date }): Promise<any> {
  const id = randomUUID();
  try {
    return await queryOne(
      `INSERT INTO "VerificationToken" (id, "userId", "codeHash", purpose, "expiresAt", "createdAt")
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [id, input.userId, input.codeHash, input.purpose, input.expiresAt]
    );
  } catch (err) {
    const token = { id, userId: input.userId, codeHash: input.codeHash, purpose: input.purpose, expiresAt: input.expiresAt, createdAt: new Date() };
    MOCK_TOKENS.push(token);
    return token;
  }
}

export async function findLatestActiveToken(userId: string, purpose: VerificationPurpose): Promise<any> {
  try {
    return await queryOne(
      `SELECT * FROM "VerificationToken"
       WHERE "userId" = $1 AND purpose = $2 AND "consumedAt" IS NULL AND "expiresAt" > NOW()
       ORDER BY "createdAt" DESC
       LIMIT 1`,
      [userId, purpose]
    );
  } catch (err) {
    return MOCK_TOKENS.filter((t) => t.userId === userId && t.purpose === purpose && !t.consumedAt && t.expiresAt > new Date()).pop() || null;
  }
}

export async function consumeVerificationToken(id: string): Promise<any> {
  try {
    return await queryOne(
      `UPDATE "VerificationToken" SET "consumedAt" = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
  } catch (err) {
    const token = MOCK_TOKENS.find((t) => t.id === id);
    if (token) token.consumedAt = new Date();
    return token || null;
  }
}

export async function storeRefreshToken(input: { userId: string; tokenHash: string; expiresAt: Date }): Promise<any> {
  const id = randomUUID();
  try {
    return await queryOne(
      `INSERT INTO "RefreshToken" (id, "userId", "tokenHash", "expiresAt", "createdAt")
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [id, input.userId, input.tokenHash, input.expiresAt]
    );
  } catch (err) {
    const rt = { id, userId: input.userId, tokenHash: input.tokenHash, expiresAt: input.expiresAt, createdAt: new Date() };
    MOCK_REFRESH_TOKENS.push(rt);
    return rt;
  }
}

export async function findActiveRefreshToken(tokenHash: string): Promise<any> {
  try {
    return await queryOne(
      `SELECT * FROM "RefreshToken"
       WHERE "tokenHash" = $1 AND "revokedAt" IS NULL AND "expiresAt" > NOW()`,
      [tokenHash]
    );
  } catch (err) {
    return MOCK_REFRESH_TOKENS.find((rt) => rt.tokenHash === tokenHash && !rt.revokedAt && rt.expiresAt > new Date()) || null;
  }
}

export async function revokeRefreshToken(tokenHash: string): Promise<any> {
  try {
    return await queryOne(
      `UPDATE "RefreshToken" SET "revokedAt" = NOW() WHERE "tokenHash" = $1 RETURNING *`,
      [tokenHash]
    );
  } catch (err) {
    const rt = MOCK_REFRESH_TOKENS.find((r) => r.tokenHash === tokenHash);
    if (rt) rt.revokedAt = new Date();
    return rt || null;
  }
}
