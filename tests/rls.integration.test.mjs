import test from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

const url = process.env.TEST_SUPABASE_URL;
const publicKey = process.env.TEST_SUPABASE_PUBLISHABLE_KEY;
const secret = process.env.TEST_SUPABASE_SECRET_KEY;
const enabled = url && publicKey && secret && process.env.TEST_ALLOW_WRITE === "isolated-test-project";

test("Auth y RLS contra proyecto aislado de Supabase", { skip: !enabled, timeout: 90000 }, async t => {
  const options = { auth: { persistSession: false, autoRefreshToken: false } };
  const service = createClient(url, secret, options);
  const anon = createClient(url, publicKey, options);
  const users = [];
  const accounts = [];
  const password = crypto.randomUUID() + "!aA9";
  const id = crypto.randomUUID();
  const review = { id, title: "Prueba de comunidad", subject: "Proyecto de prueba", body: "Texto de prueba original suficientemente largo para validar la comunidad." };
  try {
    for (let i = 0; i < 2; i++) {
      const email = `orbit-test-${crypto.randomUUID()}@example.com`;
      const { data, error } = await service.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name: "Prueba", role: "admin" } });
      assert.ifError(error);
      users.push(data.user.id);
      const client = createClient(url, publicKey, options);
      const login = await client.auth.signInWithPassword({ email, password });
      assert.ifError(login.error);
      accounts.push(client);
    }
    const [owner, other] = accounts;
    await t.test("metadata no convierte a un miembro en administrador", async () => {
      const { data, error } = await owner.rpc("is_admin");
      assert.ifError(error); assert.equal(data, false);
      const escalation = await owner.from("admin_users").insert({ user_id: users[0] });
      assert.ok(escalation.error);
    });
    await t.test("anónimo no puede escribir", async () => {
      const result = await anon.from("reviews").insert({ ...review, author_id: users[0], author_name: "Prueba" });
      assert.ok(result.error);
    });
    await t.test("propietario crea reseña, anónimo puede leer", async () => {
      assert.ifError((await owner.from("reviews").insert({ ...review, author_id: users[0], author_name: "Prueba" })).error);
      const result = await anon.from("reviews").select("id").eq("id", id);
      assert.ifError(result.error); assert.equal(result.data.length, 1);
    });
    await t.test("identidad falsa, título vacío y duplicado se rechazan", async () => {
      assert.ok((await other.from("reviews").insert({ ...review, id: crypto.randomUUID(), author_id: users[0], author_name: "Otro" })).error);
      assert.ok((await owner.from("reviews").insert({ ...review, id: crypto.randomUUID(), title: "", author_id: users[0], author_name: "Prueba" })).error);
      assert.equal((await owner.from("reviews").insert({ ...review, author_id: users[0], author_name: "Prueba" })).error.code, "23505");
    });
    await t.test("otro miembro no puede eliminar la reseña", async () => {
      const result = await other.from("reviews").delete().eq("id", id).select("id");
      assert.ifError(result.error); assert.equal(result.data.length, 0);
    });
    const commentId = crypto.randomUUID();
    await t.test("comentar y borrar comentario propio", async () => {
      assert.ifError((await other.from("comments").insert({ id: commentId, review_id: id, author_id: users[1], author_name: "Otra mirada", body: "Comentario de prueba." })).error);
      const denied = await owner.from("comments").delete().eq("id", commentId).select("id");
      assert.ifError(denied.error); assert.equal(denied.data.length, 0);
      const allowed = await other.from("comments").delete().eq("id", commentId).select("id");
      assert.ifError(allowed.error); assert.equal(allowed.data.length, 1);
    });
    await t.test("administrador modera y la eliminación es en cascada", async () => {
      assert.ifError((await other.from("comments").insert({ id: crypto.randomUUID(), review_id: id, author_id: users[1], author_name: "Prueba", body: "Comentario en cascada." })).error);
      assert.ifError((await service.from("admin_users").insert({ user_id: users[1] })).error);
      const result = await other.from("reviews").delete().eq("id", id).select("id");
      assert.ifError(result.error); assert.equal(result.data.length, 1);
      const comments = await anon.from("comments").select("id").eq("review_id", id);
      assert.ifError(comments.error); assert.equal(comments.data.length, 0);
    });
    await t.test("sesión cerrada pierde acceso de escritura", async () => {
      assert.ifError((await owner.auth.signOut()).error);
      assert.ok((await owner.from("reviews").insert({ ...review, id: crypto.randomUUID(), author_id: users[0], author_name: "Prueba" })).error);
    });
  } finally {
    for (const user of users) {
      const { error } = await service.auth.admin.deleteUser(user);
      assert.ifError(error);
    }
  }
});

