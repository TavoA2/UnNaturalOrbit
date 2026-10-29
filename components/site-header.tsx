"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight, Menu, Orbit, X } from "lucide-react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  return (
    <header className="site-header" onKeyDown={event => { if (event.key === "Escape" && open) { setOpen(false); toggle.current?.focus(); } }}>
      <Link href="/" aria-label="UnnaturalOrbit, inicio" className="wordmark">
        <Orbit aria-hidden="true" size={28} strokeWidth={1.1} />
        <span>unnaturalorbit<span className="wordmark-dot">.</span></span>
      </Link>
      <button ref={toggle} className="nav-toggle" type="button" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>
        {open ? "Cerrar" : "Menú"}{open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
      </button>
      <nav id="site-navigation" aria-label="Navegación principal" className={`site-navigation ${open ? "is-open" : ""}`} onClick={event => { if ((event.target as HTMLElement).closest("a")) setOpen(false); }}>
        <Link href="/#archivo">Archivo</Link>
        <Link href="/#artistas">Artistas</Link>
        <Link href="/resenas">Reseñas</Link>
        <Link href="/#proyecto" className="nav-project">El proyecto</Link>
        <Link href="/contact">Contacto</Link>
        <Link href="/login" className="nav-login">Ingresar <ArrowUpRight size={14} aria-hidden="true" /></Link>
      </nav>
    </header>
  );
}


