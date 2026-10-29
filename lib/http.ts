import { z } from "zod";

export class HttpError extends Error {
  status: number; constructor(status: number, message: string) { super(message); this.status = status; }
}
export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "private, no-store" } });
}
export function assertOrigin(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    throw new HttpError(403, "Origen de solicitud no permitido.");
}
export async function parseBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new HttpError(415, "Envía contenido JSON.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "Solicitud vacía.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 24000) { await reader.cancel(); throw new HttpError(413, "Contenido demasiado grande."); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  let body: unknown;
  try { body = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new HttpError(400, "JSON inválido."); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Datos inválidos.");
  return parsed.data;
}
export function failure(error: unknown) {
  return error instanceof HttpError ? json({ error: error.message }, error.status)
    : json({ error: "No se pudo completar la operación. Intenta nuevamente." }, 503);
}
export function databaseError(code: string): never {
  if (code === "P0001") throw new HttpError(429, "Alcanzaste el límite de aportes de esta hora. Intenta más tarde.");
  if (code === "23505") throw new HttpError(409, "Este contenido ya se envió. Actualiza la página.");
  if (code === "42501") throw new HttpError(403, "No tienes permiso para realizar esta acción.");
  throw new HttpError(503, "No se pudo consultar la comunidad. Verifica la configuración de Supabase.");
}


