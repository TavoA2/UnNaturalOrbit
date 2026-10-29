"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { categoryLabel } from "@/lib/gallery";
import type { Artwork } from "@/types/artwork";

export function ArtworkDialog({ artwork, onClose, onNavigate, position, total }: {
  artwork: Artwork; onClose: () => void; onNavigate: (direction: number) => void; position: number; total: number;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    closeButton.current?.focus();
    document.body.style.overflow = "hidden";
    return () => { element.close(); document.body.style.overflow = previousOverflow; };
  }, []);

  return (
    <dialog ref={dialog} className="artwork-dialog" aria-labelledby="artwork-title" aria-describedby="artwork-description"
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={event => {
        if (total < 2) return;
        if (event.key === "ArrowRight") { event.preventDefault(); onNavigate(1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); onNavigate(-1); }
      }}>
      <div className="artwork-dialog-layout">
        <div className="detail-image">
          <Image src={artwork.image} alt={artwork.alt} fill placeholder="blur" sizes="(max-width: 760px) 90vw, 60vw" className="detail-artwork" />
        </div>
        <div className="detail-information">
          <div className="detail-topline"><span className="eyebrow">Ficha de obra</span><button ref={closeButton} type="button" className="icon-button" aria-label="Cerrar detalle" onClick={onClose}><X size={21} strokeWidth={1.2} /></button></div>
          <p className="detail-category">{categoryLabel(artwork.category)} / {artwork.technique}</p>
          <h2 id="artwork-title">{artwork.title}</h2>
          <p id="artwork-description" className="detail-description">{artwork.description}</p>
          <dl className="artwork-attributes">
            <div><dt>Serie</dt><dd>{artwork.collection}</dd></div>
            <div><dt>Técnica / soporte</dt><dd>{artwork.medium}</dd></div>
            <div><dt>Dimensiones</dt><dd>{artwork.dimensions}</dd></div>
            <div><dt>Año</dt><dd>{artwork.year} · Ejemplo</dd></div>
          </dl>
          <p className="sample-label"><span className="small-dot" /> Imagen y atributos de muestra.</p>
          <div className="detail-bottom">
            <span>{String(position).padStart(2, "0")} <span className="detail-separator">/</span> {String(total).padStart(2, "0")}</span>
            {total > 1 && <div className="detail-navigation">
              <button type="button" className="icon-button" aria-label="Obra anterior" onClick={() => onNavigate(-1)}><ArrowLeft size={19} /></button>
              <button type="button" className="icon-button" aria-label="Obra siguiente" onClick={() => onNavigate(1)}><ArrowRight size={19} /></button>
            </div>}
          </div>
        </div>
      </div>
    </dialog>
  );
}


