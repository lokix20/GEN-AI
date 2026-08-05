import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.DATABASE_URL.includes("supabase.co") || env.DATABASE_URL.includes("pooler.supabase.com")
    ? { rejectUnauthorized: false }
    : undefined,
});

export async function query(text: string, params?: any[]): Promise<any[]> {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
}

export async function queryOne(text: string, params?: any[]): Promise<any> {
  const rows = await query(text, params);
  return rows[0] || null;
}
