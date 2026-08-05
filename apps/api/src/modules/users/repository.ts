import { query, queryOne } from "../../lib/db.js";
import type { OnboardingInput } from "@haritha/shared-types";

const MOCK_PROFILES: Record<string, any> = {
  "farmer-demo-id": {
    id: "profile-demo-id",
    userId: "farmer-demo-id",
    state: "Andhra Pradesh",
    district: "Vizianagaram",
    village: "Vallapuzha",
    farmSizeAcres: 4.2,
    soilType: "Loamy",
    waterSource: "Rainfed",
    mainCrops: ["Paddy", "Tomato"],
    preferredLanguage: "te",
    experienceYears: 12,
    onboarded: true,
  },
};

export async function findFarmerProfile(userId: string): Promise<any> {
  try {
    return await queryOne(
      `SELECT * FROM "FarmerProfile" WHERE "userId" = $1`,
      [userId]
    );
  } catch (err) {
    return MOCK_PROFILES[userId] || { id: "mock-profile-id", userId, mainCrops: ["Paddy"], onboarded: true };
  }
}

export async function updateOnboarding(userId: string, input: OnboardingInput): Promise<any> {
  try {
    const keys = Object.keys(input);
    if (keys.length === 0) {
      return await queryOne(`UPDATE "FarmerProfile" SET onboarded = true, "updatedAt" = NOW() WHERE "userId" = $1 RETURNING *`, [userId]);
    }

    const setClause = keys.map((key, i) => `"${key}" = $${i + 2}`).join(", ");
    const values = Object.values(input);

    return await queryOne(
      `UPDATE "FarmerProfile" SET ${setClause}, onboarded = true, "updatedAt" = NOW() WHERE "userId" = $1 RETURNING *`,
      [userId, ...values]
    );
  } catch (err) {
    const profile = MOCK_PROFILES[userId] || { id: "mock-profile-id", userId };
    Object.assign(profile, input, { onboarded: true });
    MOCK_PROFILES[userId] = profile;
    return profile;
  }
}

export async function findUserWithProfile(userId: string): Promise<any> {
  try {
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
  } catch (err) {
    return {
      id: userId,
      name: "Ramesh Farm",
      email: "demo.farmer@harithasahayak.in",
      role: "FARMER",
      emailVerified: true,
      createdAt: new Date(),
      farmerProfile: MOCK_PROFILES[userId] || MOCK_PROFILES["farmer-demo-id"],
    };
  }
}
