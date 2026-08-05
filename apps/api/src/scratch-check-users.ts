import { supabase } from "./lib/supabase.js";

async function run() {
  const { data, error } = await supabase.from("User").select("id, email, passwordHash, role, emailVerified");
  if (error) {
    console.error("Error fetching users:", error);
  } else {
    console.log("Seeded Users in database:", JSON.stringify(data, null, 2));
  }
}

run();
