"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, message } from "@/lib/api-client";
import type { Review, Session } from "@/types/community";
import { ReviewForm } from "@/components/review-form";
import { Comments } from "@/components/comments";
import { DeleteButton } from "@/components/delete-button";

export function Community() {
  const [session, setSession] = useState<Session | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  async function load(next = 0) {
    setError(""); setLoading(true);
    try {
      const data = await api<{ reviews: Review[] }>(`/api/reviews?page=${next}`);
      setReviews(old => next ? [...old, ...data.reviews.filter(r => !old.some(item => item.id === r.id))] : data.reviews);
      setPage(next); setMore(data.reviews.length === 10);
    } catch (error) { setError(message(error)); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    let active = true;
    async function initialize() {
      try {
        const current = await api<Session>("/api/session");
        if (!active) return;
        setSession(current);
        if (!current.configured) return;
        const data = await api<{ reviews: Review[] }>("/api/reviews");
        if (active) { setReviews(data.reviews); setMore(data.reviews.length === 10); }
      } catch (error) { if (active) setError(message(error)); }
      finally { if (active) setLoading(false); }
    }
    initialize();
    return () => { active = false; };
  }, []);
  async function logout() {
    setSigningOut(true);
    try {
      await api("/api/auth", { method: "POST", body: JSON.stringify({ action: "logout" }) });
      setSession({ configured: true, user: null, admin: false });
    } catch (error) { setError(message(error)); }
    finally { setSigningOut(false); }
  }
  return <>
    {session?.configured === false && <p className="notice mb-10" role="status">La comunidad está en preparación. Las reseñas y el acceso se habilitarán al conectar Supabase.</p>}
    {session?.user && <div className="mb-8 flex flex-wrap items-center gap-6 text-sm">
      <span>Sesión iniciada{session.admin ? " · Administración" : ""}</span>
      {session.admin && <Link href="/admin" className="underline">Administrar</Link>}
      <button type="button" disabled={signingOut} onClick={logout} className="underline">{signingOut ? "Cerrando…" : "Cerrar sesión"}</button>
    </div>}
    <div className="grid items-start gap-12 lg:grid-cols-[1fr_340px] lg:gap-20">
      <section aria-label="Reseñas de la comunidad">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-current/20 pb-4">
          <h2 className="font-serif text-3xl">Miradas compartidas</h2><span className="eyebrow">Comunidad</span>
        </div>
        {loading && <p role="status">Cargando reseñas…</p>}
        {error && <div role="alert" className="notice"><p>{error}</p><button type="button" onClick={() => window.location.reload()} className="mt-3 underline">Volver a intentar</button></div>}
        {!loading && !error && session?.configured && !reviews.length && <p className="py-8 leading-relaxed">Cada conversación empieza con una mirada. Comparte la primera reseña.</p>}
        <div className="space-y-10">
          {reviews.map(review => <article key={review.id} className="border-b border-current/20 pb-10">
            <p className="eyebrow break-words">{review.subject}</p>
            <h3 className="mt-3 break-words font-serif text-3xl">{review.title}</h3>
            <p className="mt-3 text-xs text-foreground/70">{review.author_name} · {new Date(review.created_at).toLocaleDateString("es-CR")}</p>
            <p className="mt-6 whitespace-pre-wrap break-words leading-relaxed">{review.body}</p>
            <button type="button" aria-expanded={open === review.id} className="mt-6 text-sm underline" onClick={() => setOpen(open === review.id ? null : review.id)}>
              {open === review.id ? "Cerrar comentarios" : "Leer y añadir comentarios ↗"}
            </button>
            {(session?.admin || session?.user?.id === review.author_id) && <DeleteButton path={`/api/reviews/${review.id}`} label="Eliminar reseña y sus comentarios" onDeleted={() => load()} />}
            {open === review.id && session && <Comments reviewId={review.id} session={session} />}
          </article>)}
        </div>
        {more && <button type="button" disabled={loading} className="button-primary mt-8" onClick={() => load(page + 1)}>Cargar más reseñas</button>}
      </section>
      <aside className="border border-current/20 p-6 md:p-8">
        <h2 className="mb-4 font-serif text-3xl">Comparte tu mirada</h2>
        <p className="mb-6 text-sm leading-relaxed">Una exposición que te movió, un disco que sigue sonando, un proyecto que merece encontrarse. Escribe con respeto y desde tu experiencia.</p>
        {session?.user ? <ReviewForm onCreated={() => load()} /> : <Link href="/login" className="button-primary inline-block">Inicia sesión para escribir ↗</Link>}
      </aside>
    </div>
  </>;
}

