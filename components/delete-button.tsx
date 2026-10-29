"use client";

import { useState } from "react";
import { api, message } from "@/lib/api-client";

export function DeleteButton({ path, label, onDeleted }: { path: string; label: string; onDeleted: () => Promise<void> }) {
  const [confirm, setConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function remove() {
    setPending(true); setError("");
    try { await api(path, { method: "DELETE" }); setConfirm(false); await onDeleted(); }
    catch (error) { setError(message(error)); }
    finally { setPending(false); }
  }
  return <div className="mt-3 text-xs">
    {confirm ? <div className="flex flex-wrap items-center gap-4">
      <span>¿Eliminar permanentemente? No se puede deshacer.</span>
      <button type="button" disabled={pending} className="underline danger-link" onClick={remove}>{pending ? "Eliminando…" : "Sí, eliminar"}</button>
      <button type="button" disabled={pending} className="underline" onClick={() => setConfirm(false)}>Cancelar</button>
    </div> : <button type="button" className="underline danger-link" onClick={() => setConfirm(true)}>{label}</button>}
    {error && <p role="alert">{error}</p>}
  </div>;
}


