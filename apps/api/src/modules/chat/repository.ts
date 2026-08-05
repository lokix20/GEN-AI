import { supabase, parseDates } from "../../lib/supabase.js";

export async function listSessions(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from("ChatSession")
    .select("*, messages:ChatMessage(*)")
    .eq("userId", userId)
    .order("isPinned", { ascending: false })
    .order("updatedAt", { ascending: false });

  if (error) throw error;

  // Emulate include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } }
  if (data) {
    data.forEach((session: any) => {
      if (session.messages && session.messages.length > 0) {
        session.messages.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        session.messages = session.messages.slice(0, 1);
      }
    });
  }

  return parseDates<any[]>(data);
}

export async function findSession(userId: string, sessionId: string): Promise<any> {
  const { data, error } = await supabase
    .from("ChatSession")
    .select("*")
    .eq("id", sessionId)
    .eq("userId", userId)
    .maybeSingle();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function createSession(userId: string, title: string): Promise<any> {
  const { data, error } = await supabase
    .from("ChatSession")
    .insert({ userId, title })
    .select()
    .single();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function touchSession(sessionId: string): Promise<any> {
  const { data, error } = await supabase
    .from("ChatSession")
    .update({ updatedAt: new Date().toISOString() })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function updateSession(sessionId: string, data: { title?: string; isPinned?: boolean }): Promise<any> {
  const { data: updated, error } = await supabase
    .from("ChatSession")
    .update(data)
    .eq("id", sessionId)
    .select()
    .single();

  if (error) throw error;
  return parseDates<any>(updated);
}

export async function deleteSession(sessionId: string): Promise<any> {
  const { data, error } = await supabase
    .from("ChatSession")
    .delete()
    .eq("id", sessionId)
    .select()
    .single();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function listMessages(sessionId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from("ChatMessage")
    .select("*")
    .eq("sessionId", sessionId)
    .order("createdAt", { ascending: true });

  if (error) throw error;
  return parseDates<any[]>(data);
}

export async function createMessage(input: { sessionId: string; role: "user" | "assistant"; content: string; imageUrl?: string | null }): Promise<any> {
  const { data, error } = await supabase
    .from("ChatMessage")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return parseDates<any>(data);
}
