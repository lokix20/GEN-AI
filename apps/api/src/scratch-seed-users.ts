import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { query, queryOne } from "./lib/db.js";

async function run() {
  console.log("Seeding database via direct PostgreSQL connection...");

  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Create Farmer
  const farmerEmail = "demo.farmer@harithasahayak.in";
  
  // Clean existing user
  await query(`DELETE FROM "User" WHERE email = $1`, [farmerEmail]);
  
  const farmerId = randomUUID();
  const farmer = await queryOne(
    `INSERT INTO "User" (id, name, email, phone, "passwordHash", role, "emailVerified", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, 'FARMER', true, NOW(), NOW())
     RETURNING *`,
    [farmerId, "Ramesh Farm", farmerEmail, "9876543210", passwordHash]
  );

  console.log("Created Farmer user:", farmer.id);

  // Create Farmer Profile
  const profileId = randomUUID();
  await query(
    `INSERT INTO "FarmerProfile" (id, "userId", state, district, village, "farmSizeAcres", "soilType", "waterSource", "mainCrops", "preferredLanguage", "experienceYears", onboarded, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, NOW(), NOW())`,
    [
      profileId,
      farmer.id,
      "Kerala",
      "Palakkad",
      "Vallapuzha",
      4.2,
      "Loamy",
      "Rainfed",
      ["Rice", "Coconut"],
      "en",
      12
    ]
  );

  console.log("Created Farmer Profile.");

  // 2. Create Admin
  const adminEmail = "admin@harithasahayak.in";
  await query(`DELETE FROM "User" WHERE email = $1`, [adminEmail]);

  const adminId = randomUUID();
  const admin = await queryOne(
    `INSERT INTO "User" (id, name, email, phone, "passwordHash", role, "emailVerified", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, 'ADMIN', true, NOW(), NOW())
     RETURNING *`,
    [adminId, "Admin User", adminEmail, "9999999999", passwordHash]
  );

  console.log("Created Admin user:", admin.id);
  console.log("Seeding complete!");
}

run();
