import test from "node:test";
import assert from "node:assert/strict";
import { reviewSchema, commentSchema, authSchema } from "../validations/community.ts";
import { assertOrigin, parseBody, failure, HttpError } from "../lib/http.ts";

const review = { id: crypto.randomUUID(), title: "Una ciudad que escucha", subject: "Archivo del viento", body: "Una experiencia que transforma la escucha y nuestra relación con el espacio." };

test("acepta una reseña válida y conserva saltos de línea", () => {
  const input = { ...review, body: review.body + "\n\nOtro párrafo." };
  assert.equal(reviewSchema.parse(input).body, input.body);
});
test("rechaza títulos vacíos, contenido corto y límites excedidos", () => {
  for (const patch of [{ title: " " }, { body: "corto" }, { subject: " " }, { title: "a".repeat(121) }, { body: "a".repeat(5001) }])
    assert.equal(reviewSchema.safeParse({ ...review, ...patch }).success, false);
});
test("impide introducir identidad o privilegios en una reseña", () => {
  assert.equal(reviewSchema.safeParse({ ...review, author_id: crypto.randomUUID() }).success, false);
  assert.equal(reviewSchema.safeParse({ ...review, admin: true }).success, false);
});
test("valida UUID de idempotencia", () => {
  assert.equal(reviewSchema.safeParse({ ...review, id: "inventado" }).success, false);
});
test("valida comentarios y rechaza campos adicionales", () => {
  const input = { id: crypto.randomUUID(), body: "Gracias por compartir tu mirada." };
  assert.equal(commentSchema.safeParse(input).success, true);
  assert.equal(commentSchema.safeParse({ ...input, body: " " }).success, false);
  assert.equal(commentSchema.safeParse({ ...input, body: "x".repeat(1001) }).success, false);
  assert.equal(commentSchema.safeParse({ ...input, author_id: "otro" }).success, false);
});
test("login y registro validan credenciales y nombre público", () => {
  assert.equal(authSchema.safeParse({ action: "login", email: "persona@example.com", password: "password-seguro" }).success, true);
  assert.equal(authSchema.safeParse({ action: "login", email: "invalido", password: "1" }).success, false);
  assert.equal(authSchema.safeParse({ action: "signup", email: "a@example.com", password: "password-seguro", name: "" }).success, false);
  const data = authSchema.parse({ action: "signup", email: "a@example.com", password: "password-seguro", name: "Lector", role: "admin" });
  assert.equal("role" in data, false);
});
test("rechaza solicitudes de escritura desde otro origen o sin origen", () => {
  const request = origin => new Request("https://orbit.example/api/reviews", { method: "POST", headers: origin ? { origin } : {} });
  assert.doesNotThrow(() => assertOrigin(request("https://orbit.example")));
  assert.throws(() => assertOrigin(request("https://otro.example")), error => error.status === 403);
  assert.throws(() => assertOrigin(request()), error => error.status === 403);
});
test("parsing del servidor rechaza JSON inválido, tipo y tamaño excesivo", async () => {
  const request = (body, type = "application/json") => new Request("https://orbit.example", { method: "POST", headers: { "content-type": type }, body });
  await assert.rejects(parseBody(request("{"), reviewSchema), error => error.status === 400);
  await assert.rejects(parseBody(request("texto", "text/plain"), reviewSchema), error => error.status === 415);
  await assert.rejects(parseBody(request("x".repeat(24001)), reviewSchema), error => error.status === 413);
  assert.deepEqual(await parseBody(request(JSON.stringify(review)), reviewSchema), review);
});
test("los errores no filtran detalles internos y no se almacenan en caché", async () => {
  const response = failure(new Error("secreto-interno"));
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal(JSON.stringify(await response.json()).includes("secreto"), false);
  assert.equal(failure(new HttpError(401, "Inicia sesión")).status, 401);
});

