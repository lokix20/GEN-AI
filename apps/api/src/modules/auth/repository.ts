import type { Role, VerificationPurpose } from "../../types/database.js";
import { supabase, parseDates } from "../../lib/supabase.js";

export async function findUserByEmail(email: string): Promise<any> {
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function findUserById(id: string): Promise<any> {
  const { data, error } = await supabase
    .from("User")
    .select("*, farmerProfile:FarmerProfile(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function findUserByGoogleId(googleId: string): Promise<any> {
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("googleId", googleId)
    .maybeSingle();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function createUser(input: { name: string; email: string; phone: string; passwordHash: string; role: Role }): Promise<any> {
  const { data: user, error: userError } = await supabase
    .from("User")
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash: input.passwordHash,
      role: input.role,
    })
    .select()
    .single();

  if (userError) throw userError;

  if (input.role === "FARMER") {
    const { error: profileError } = await supabase
      .from("FarmerProfile")
      .insert({ userId: user.id });
    if (profileError) throw profileError;
  }

  return parseDates<any>(user);
}

export async function createGoogleUser(input: { name: string; email: string; googleId: string }): Promise<any> {
  const { data: user, error: userError } = await supabase
    .from("User")
    .insert({
      name: input.name,
      email: input.email,
      googleId: input.googleId,
      passwordHash: "",
      emailVerified: true,
      role: "FARMER",
    })
    .select()
    .single();

  if (userError) throw userError;

  const { error: profileError } = await supabase
    .from("FarmerProfile")
    .insert({ userId: user.id });
  if (profileError) throw profileError;

  return parseDates<any>(user);
}

export async function markEmailVerified(userId: string): Promise<any> {
  const { data, error } = await supabase
    .from("User")
    .update({ emailVerified: true })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function updatePasswordHash(userId: string, passwordHash: string): Promise<any> {
  const { data, error } = await supabase
    .from("User")
    .update({ passwordHash })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function createVerificationToken(input: { userId: string; codeHash: string; purpose: VerificationPurpose; expiresAt: Date }): Promise<any> {
  const { data, error } = await supabase
    .from("VerificationToken")
    .insert({
      userId: input.userId,
      codeHash: input.codeHash,
      purpose: input.purpose,
      expiresAt: input.expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function findLatestActiveToken(userId: string, purpose: VerificationPurpose): Promise<any> {
  const { data, error } = await supabase
    .from("VerificationToken")
    .select("*")
    .eq("userId", userId)
    .eq("purpose", purpose)
    .is("consumedAt", null)
    .gt("expiresAt", new Date().toISOString())
    .order("createdAt", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function consumeVerificationToken(id: string): Promise<any> {
  const { data, error } = await supabase
    .from("VerificationToken")
    .update({ consumedAt: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function storeRefreshToken(input: { userId: string; tokenHash: string; expiresAt: Date }): Promise<any> {
  const { data, error } = await supabase
    .from("RefreshToken")
    .insert({
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function findActiveRefreshToken(tokenHash: string): Promise<any> {
  const { data, error } = await supabase
    .from("RefreshToken")
    .select("*")
    .eq("tokenHash", tokenHash)
    .is("revokedAt", null)
    .gt("expiresAt", new Date().toISOString())
    .maybeSingle();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function revokeRefreshToken(tokenHash: string): Promise<any> {
  const { data, error } = await supabase
    .from("RefreshToken")
    .update({ revokedAt: new Date().toISOString() })
    .eq("tokenHash", tokenHash);

  if (error) throw error;
  return parseDates<any>(data);
}
