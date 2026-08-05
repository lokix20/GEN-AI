import { randomUUID } from "node:crypto";
import type { Role, VerificationPurpose } from "../../types/database.js";
import { query, queryOne } from "../../lib/db.js";

export async function findUserByEmail(email: string): Promise<any> {
  return queryOne(
    `SELECT * FROM "User" WHERE email = $1`,
    [email]
  );
}

export async function findUserById(id: string): Promise<any> {
  const user = await queryOne(
    `SELECT * FROM "User" WHERE id = $1`,
    [id]
  );
  if (!user) return null;

  const profile = await queryOne(
    `SELECT * FROM "FarmerProfile" WHERE "userId" = $1`,
    [id]
  );
  user.farmerProfile = profile;
  return user;
}

export async function findUserByGoogleId(googleId: string): Promise<any> {
  return queryOne(
    `SELECT * FROM "User" WHERE "googleId" = $1`,
    [googleId]
  );
}

export async function createUser(input: { name: string; email: string; phone: string; passwordHash: string; role: Role }): Promise<any> {
  const userId = randomUUID();
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
}

export async function createGoogleUser(input: { name: string; email: string; googleId: string }): Promise<any> {
  const userId = randomUUID();
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
}

export async function markEmailVerified(userId: string): Promise<any> {
  return queryOne(
    `UPDATE "User" SET "emailVerified" = true, "updatedAt" = NOW() WHERE id = $1 RETURNING *`,
    [userId]
  );
}

export async function updatePasswordHash(userId: string, passwordHash: string): Promise<any> {
  return queryOne(
    `UPDATE "User" SET "passwordHash" = $2, "updatedAt" = NOW() WHERE id = $1 RETURNING *`,
    [userId, passwordHash]
  );
}

export async function createVerificationToken(input: { userId: string; codeHash: string; purpose: VerificationPurpose; expiresAt: Date }): Promise<any> {
  const id = randomUUID();
  return queryOne(
    `INSERT INTO "VerificationToken" (id, "userId", "codeHash", purpose, "expiresAt", "createdAt")
     VALUES ($1, $2, $3, $4, $5, NOW())
     RETURNING *`,
    [id, input.userId, input.codeHash, input.purpose, input.expiresAt]
  );
}

export async function findLatestActiveToken(userId: string, purpose: VerificationPurpose): Promise<any> {
  return queryOne(
    `SELECT * FROM "VerificationToken"
     WHERE "userId" = $1 AND purpose = $2 AND "consumedAt" IS NULL AND "expiresAt" > NOW()
     ORDER BY "createdAt" DESC
     LIMIT 1`,
    [userId, purpose]
  );
}

export async function consumeVerificationToken(id: string): Promise<any> {
  return queryOne(
    `UPDATE "VerificationToken" SET "consumedAt" = NOW() WHERE id = $1 RETURNING *`,
    [id]
  );
}

export async function storeRefreshToken(input: { userId: string; tokenHash: string; expiresAt: Date }): Promise<any> {
  const id = randomUUID();
  return queryOne(
    `INSERT INTO "RefreshToken" (id, "userId", "tokenHash", "expiresAt", "createdAt")
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING *`,
    [id, input.userId, input.tokenHash, input.expiresAt]
  );
}

export async function findActiveRefreshToken(tokenHash: string): Promise<any> {
  return queryOne(
    `SELECT * FROM "RefreshToken"
     WHERE "tokenHash" = $1 AND "revokedAt" IS NULL AND "expiresAt" > NOW()`,
    [tokenHash]
  );
}

export async function revokeRefreshToken(tokenHash: string): Promise<any> {
  return queryOne(
    `UPDATE "RefreshToken" SET "revokedAt" = NOW() WHERE "tokenHash" = $1 RETURNING *`,
    [tokenHash]
  );
}
