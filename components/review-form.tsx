"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { reviewSchema } from "@/validations/community";
import { api, message } from "@/lib/api-client";

const schema = reviewSchema.omit({ id: true });
type Values = z.infer<typeof schema>;

export function ReviewForm({ onCreated }: { onCreated: () => Promise<void> }) {
  const key = useRef<string | null>(null);
  const [notice, setNotice] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });
  async function submit(values: Values) {
    key.current ??= crypto.randomUUID();
    setNotice("");
    try {
      await api("/api/reviews", { method: "POST", body: JSON.stringify({ ...values, id: key.current }) });
      reset(); key.current = null; setNotice("Tu reseña ya forma parte de la conversación.");
      await onCreated();
    } catch (error) { setNotice(message(error)); }
  }
  return <form onSubmit={event => { void handleSubmit(submit)(event); }} className="space-y-4" noValidate>
    <fieldset disabled={isSubmitting} className="space-y-4">
      <div><label htmlFor="review-title">Título de tu reseña</label>
        <input id="review-title" maxLength={120} {...register("title")} aria-invalid={!!errors.title} aria-describedby="review-title-error" />
        <p id="review-title-error" className="field-error">{errors.title?.message}</p></div>
      <div><label htmlFor="review-subject">Obra, artista o proyecto</label>
        <input id="review-subject" maxLength={160} {...register("subject")} aria-invalid={!!errors.subject} aria-describedby="review-subject-error" />
        <p id="review-subject-error" className="field-error">{errors.subject?.message}</p></div>
      <div><label htmlFor="review-body">Tu mirada</label>
        <textarea id="review-body" rows={7} maxLength={5000} {...register("body")} aria-invalid={!!errors.body} aria-describedby="review-body-error" />
        <p id="review-body-error" className="field-error">{errors.body?.message}</p></div>
      <button type="submit" className="button-primary">{isSubmitting ? "Publicando…" : "Compartir reseña ↗"}</button>
    </fieldset>
    <p role="status" className="text-sm">{notice}</p>
  </form>;
}


