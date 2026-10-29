import { createClient } from "@/lib/supabase/server";
import { HttpError } from "@/lib/http";

export async function communityClient() {
  const client = await createClient();
  if (!client) throw new HttpError(503, "La comunidad aún no está conectada. Falta configurar Supabase.");
  return client;
}
export async function member() {
  const client = await communityClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) throw new HttpError(401, "Inicia sesión para participar.");
  return { client, user };
}
export function authorName(user: { user_metadata: Record<string, unknown> }) {
  const name = user.user_metadata.name;
  return typeof name === "string" && name.trim() ? name.trim().slice(0, 50) : "Participante";
}

