import { createClient } from "@/lib/supabase/server";
import { failure, json } from "@/lib/http";

export async function GET() {
  try {
    const client = await createClient();
    if (!client) return json({ configured: false, user: null, admin: false });
    const { data: { user }, error } = await client.auth.getUser();
    if (error && error.status !== 400 && error.status !== 401 && error.status !== 403)
      return json({ error: "No se pudo verificar la sesión." }, 503);
    if (!user) return json({ configured: true, user: null, admin: false });
    const { data, error: adminError } = await client.rpc("is_admin");
    if (adminError) return json({ error: "Falta preparar la base de datos de la comunidad." }, 503);
    return json({ configured: true, user: { id: user.id }, admin: data === true });
  } catch (error) { return failure(error); }
}

