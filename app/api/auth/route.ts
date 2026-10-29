import { authSchema } from "@/validations/community";
import { assertOrigin, failure, HttpError, json, parseBody } from "@/lib/http";
import { communityClient } from "@/lib/community";

export async function POST(request: Request) {
  try {
    assertOrigin(request);
    const input = await parseBody(request, authSchema);
    const client = await communityClient();
    if (input.action === "logout") {
      const { error } = await client.auth.signOut();
      if (error) throw new HttpError(503, "No se pudo cerrar la sesión.");
      return json({ message: "Sesión cerrada." });
    }
    if (input.action === "signup") {
      const site = process.env.SITE_URL;
      if (!site) throw new HttpError(503, "Falta configurar la URL del sitio para confirmar el correo.");
      const { error } = await client.auth.signUp({
        email: input.email, password: input.password,
        options: { data: { name: input.name }, emailRedirectTo: new URL("/auth/confirm", site).href },
      });
      if (error) throw new HttpError(400, "No se pudo crear la cuenta. Revisa los datos o intenta más tarde.");
      return json({ message: "Si el correo puede registrarse, recibirás un enlace de confirmación. Revisa tu bandeja y luego inicia sesión." });
    }
    const { error } = await client.auth.signInWithPassword({ email: input.email, password: input.password });
    if (error) throw new HttpError(401, "No se pudo iniciar sesión. Revisa el correo, la contraseña y la confirmación de tu cuenta.");
    return json({ message: "Sesión iniciada." });
  } catch (error) { return failure(error); }
}

