"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { commentSchema } from "@/validations/community";
import { api, message } from "@/lib/api-client";
import type { Comment, Session } from "@/types/community";
import { DeleteButton } from "@/components/delete-button";

const schema = commentSchema.omit({ id: true });
type Values = z.infer<typeof schema>;

export function Comments({ reviewId, session }: { reviewId: string; session: Session }) {
  const [items, setItems] = useState<Comment[]>([]);
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const key = useRef<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });
  async function load(next = 0) {
    setLoading(true);
    try {
      const { comments } = await api<{ comments: Comment[] }>(`/api/reviews/${reviewId}/comments?page=${next}`);
      setItems(old => next ? [...old, ...comments.filter(c => !old.some(item => item.id === c.id))] : comments);
      setPage(next); setMore(comments.length === 20);
    } catch (error) { setNotice(message(error)); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    let active = true;
    api<{ comments: Comment[] }>(`/api/reviews/${reviewId}/comments`).then(({ comments }) => {
      if (active) { setItems(comments); setMore(comments.length === 20); }
    }).catch(error => { if (active) setNotice(message(error)); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reviewId]);
  async function submit(values: Values) {
    key.current ??= crypto.randomUUID();
    setNotice("");
    try {
      await api(`/api/reviews/${reviewId}/comments`, { method: "POST", body: JSON.stringify({ ...values, id: key.current }) });
      reset(); key.current = null; await load(); setNotice("Comentario publicado.");
    } catch (error) { setNotice(message(error)); }
  }
  return <section className="mt-6 border-t border-current/15 pt-6" aria-label="Comentarios">
    <h3 className="font-serif text-2xl">La conversación</h3>
    <div className="my-5 space-y-5">
      {items.map(item => <article key={item.id} className="border-l border-current/25 pl-4">
        <p className="text-xs text-foreground/70">{item.author_name} · {new Date(item.created_at).toLocaleDateString("es-CR")}</p>
        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{item.body}</p>
        {(session.admin || session.user?.id === item.author_id) && <DeleteButton path={`/api/comments/${item.id}`} label="Eliminar comentario" onDeleted={() => load()} />}
      </article>)}
      {!loading && !items.length && <p className="text-sm">Todavía no hay comentarios. Abre la conversación.</p>}
      {loading && <p role="status" className="text-sm">Cargando comentarios…</p>}
      {more && <button type="button" className="text-sm underline" disabled={loading} onClick={() => load(page + 1)}>Cargar más comentarios</button>}
    </div>
    {session.user ? <form onSubmit={event => { void handleSubmit(submit)(event); }} noValidate>
      <label htmlFor={`comment-${reviewId}`}>Añade tu comentario</label>
      <textarea id={`comment-${reviewId}`} rows={3} maxLength={1000} {...register("body")} aria-invalid={!!errors.body} aria-describedby={`error-${reviewId}`} disabled={isSubmitting} />
      <p id={`error-${reviewId}`} className="field-error">{errors.body?.message}</p>
      <button type="submit" className="button-primary mt-3" disabled={isSubmitting}>{isSubmitting ? "Enviando…" : "Comentar"}</button>
    </form> : <Link className="text-sm underline" href="/login">Inicia sesión para comentar</Link>}
    <p role="status" className="mt-3 text-sm">{notice}</p>
  </section>;
}


