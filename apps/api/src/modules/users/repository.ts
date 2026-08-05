import { query, queryOne } from "../../lib/db.js";
import type { OnboardingInput } from "@haritha/shared-types";

export async function findFarmerProfile(userId: string): Promise<any> {
  return queryOne(
    `SELECT * FROM "FarmerProfile" WHERE "userId" = $1`,
    [userId]
  );
}

export async function updateOnboarding(userId: string, input: OnboardingInput): Promise<any> {
  const keys = Object.keys(input);
  if (keys.length === 0) {
    return queryOne(`UPDATE "FarmerProfile" SET onboarded = true, "updatedAt" = NOW() WHERE "userId" = $1 RETURNING *`, [userId]);
  }

  const setClause = keys.map((key, i) => `"${key}" = $${i + 2}`).join(", ");
  const values = Object.values(input);

  return queryOne(
    `UPDATE "FarmerProfile" SET ${setClause}, onboarded = true, "updatedAt" = NOW() WHERE "userId" = $1 RETURNING *`,
    [userId, ...values]
  );
}

export async function findUserWithProfile(userId: string): Promise<any> {
  const user = await queryOne(
    `SELECT * FROM "User" WHERE id = $1`,
    [userId]
  );
  if (!user) return null;

  const profile = await queryOne(
    `SELECT * FROM "FarmerProfile" WHERE "userId" = $1`,
    [userId]
  );
  user.farmerProfile = profile;
  return user;
}
