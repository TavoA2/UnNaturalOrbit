"use client";

import Image from "next/image";
import "./gallery-views.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, SlidersHorizontal } from "lucide-react";
import { artworks, artworkCategories, categoryLabel } from "@/lib/gallery";
import type { Artwork, ArtworkCategory } from "@/types/artwork";

function WorkInformation({ work }: { work: Artwork }) {
  return <>
    <p className="sequence-category">{categoryLabel(work.category)} · {work.year}</p>
    <h3 id={`title-${work.id}`}>{work.title}</h3>
    <p className="sequence-description">{work.description}</p>
    <dl className="artwork-attributes">
      <div><dt>Serie</dt><dd>{work.collection}</dd></div>
      <div><dt>Técnica</dt><dd>{work.technique}</dd></div>
      <div><dt>Material / medio</dt><dd>{work.medium}</dd></div>
      <div><dt>Dimensiones</dt><dd>{work.dimensions}</dd></div>
    </dl>
  </>;
}

function GalleryControls({ index, total, title, onNavigate, persistent = false }: {
  index: number; total: number; title: string; onNavigate: (index: number) => void; persistent?: boolean;
}) {
  const first = index === 0;
  const last = index === total - 1;
  return <div className="sequence-controls">
    <span role={persistent ? "status" : undefined} aria-live={persistent ? "polite" : undefined} aria-atomic="true">
      <span aria-hidden="true">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      <span className="sr-only">Obra {index + 1} de {total}: {title}</span>
    </span>
    <div className="sequence-buttons">
      <button type="button" onClick={() => { if (!first) onNavigate(index - 1); }} disabled={!persistent && first} aria-disabled={first} aria-label="Obra anterior"><ArrowUp size={17} aria-hidden="true" /><span>Anterior</span></button>
      <button type="button" onClick={() => { if (!last) onNavigate(index + 1); }} disabled={!persistent && last} aria-disabled={last} aria-label="Obra siguiente"><span>Siguiente</span><ArrowDown size={17} aria-hidden="true" /></button>
    </div>
  </div>;
}

export function ArtworkGallery() {
  const [category, setCategory] = useState<"all" | ArtworkCategory>("all");
  const [technique, setTechnique] = useState("all");
  const [view, setView] = useState<"single" | "list">("single");
  const [cardIndex, setCardIndex] = useState(0);
  const gesture = useRef({ delta: 0, last: 0 });
  const touchStart = useRef<number | null>(null);
  const galleryViewport = useRef<HTMLDivElement>(null);
  const slides = useRef(new Map<string, HTMLElement>());
  const filtered = useMemo(() => artworks.filter(work =>
    (category === "all" || work.category === category)
    && (category !== "cuadros" || technique === "all" || work.technique === technique)), [category, technique]);
  const techniques = [...new Set(artworks.filter(work => work.category === "cuadros").map(work => work.technique))];
  const currentIndex = Math.min(cardIndex, Math.max(0, filtered.length - 1));
  useEffect(() => {
    const viewport = galleryViewport.current;
    if (!viewport || view !== "single") return;
    function wheel(event: WheelEvent) {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const card = viewport!.querySelector<HTMLElement>("article");
      if (!card || !event.deltaY) return;
      const direction = Math.sign(event.deltaY);
      // Long mobile/zoomed fiches remain readable before moving to another card.
      if ((direction > 0 && card.scrollTop + card.clientHeight < card.scrollHeight - 2)
        || (direction < 0 && card.scrollTop > 2)) return;
      if ((direction < 0 && currentIndex === 0) || (direction > 0 && currentIndex === filtered.length - 1)) return;
      event.preventDefault();
      const now = performance.now();
      if (now - gesture.current.last < 700) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport!.clientHeight : 1);
      gesture.current.delta = Math.sign(gesture.current.delta) === direction ? gesture.current.delta + delta : delta;
      if (Math.abs(gesture.current.delta) < 50) return;
      gesture.current = { delta: 0, last: now };
      setCardIndex(currentIndex + direction);
    }
    viewport.addEventListener("wheel", wheel, { passive: false });
    return () => viewport.removeEventListener("wheel", wheel);
  }, [view, currentIndex, filtered]);
  function navigate(index: number) {
    const work = filtered[index];
    if (!work) return;
    if (view === "single") { setCardIndex(index); return; }
    const target = slides.current.get(work.id);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    if (target && galleryViewport.current) {
      galleryViewport.current.scrollTo({ top: target.offsetTop, behavior });
    } else target?.scrollIntoView({ block: "start", behavior });
  }
  return (
    <section id="archivo" className="artwork-section" aria-labelledby="archive-title">
      <div className="archive-heading">
        <h2 id="archive-title">Fragmentos de una órbita<span className="heading-period">.</span></h2>
        <p className="archive-instruction">Recorre las obras con scroll<br />o con los botones anterior y siguiente.</p>
      </div>
      <div className="gallery-toolbar">
        <div className="category-filters" role="group" aria-label="Filtrar obras por categoría">
          {artworkCategories.map(item => <button key={item.id} type="button" aria-pressed={category === item.id}
            className={`category-filter ${category === item.id ? "is-active" : ""}`}
            onClick={() => { setCategory(item.id); setTechnique("all"); setCardIndex(0); }}>
            {item.label}<span className="filter-count">{item.id === "all" ? artworks.length : artworks.filter(work => work.category === item.id).length}</span>
          </button>)}
        </div>
        <span className="archive-count">{String(filtered.length).padStart(2, "0")} {filtered.length === 1 ? "obra" : "obras"}</span>
      </div>
      <div className="gallery-view-picker" role="group" aria-label="Forma de recorrer la galería">
        <span>Vista</span>
        <button type="button" aria-pressed={view === "single"} onClick={() => setView("single")}>Una obra a la vez</button>
        <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>Lista completa</button>
      </div>
      {category === "cuadros" && <div className="technique-filter">
        <label htmlFor="technique"><SlidersHorizontal size={14} aria-hidden="true" /> Técnica</label>
        <select id="technique" value={technique} onChange={event => { setTechnique(event.target.value); setCardIndex(0); }}>
          <option value="all">Todas las técnicas</option>
          {techniques.map(value => <option key={value} value={value}>{value}</option>)}
        </select>
      </div>}
      <p id="gallery-guidance" className="gallery-guidance">{view === "single" ? "Una obra, con su ficha. Desliza sobre la imagen o usa Anterior y Siguiente para cambiarla." : "Recorre la lista con scroll o usa los botones para avanzar entre obras."}</p>
      {view === "single" && <p className="mobile-reading-hint">Desliza sobre el texto para leer la ficha completa.</p>}
      <div className={view === "single" ? "deck-stage" : "list-stage"}>
      <div key={`${view}-${category}-${technique}`} ref={galleryViewport} className={`sequence-gallery ${view === "single" ? "sequence-deck" : "sequence-single"}`}
        tabIndex={0} role="region" aria-label={view === "single" ? "Baraja de obras" : "Lista de obras"}
        aria-describedby="gallery-guidance"
        onKeyDown={event => { if (view !== "single" || event.target !== event.currentTarget) return; if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); navigate(currentIndex + (event.key === "ArrowDown" ? 1 : -1)); } }}>
        {filtered.map((work, index) => view === "single" && index !== currentIndex ? null : <article key={work.id} className="sequence-work" aria-labelledby={`title-${work.id}`}
          ref={node => { if (node) slides.current.set(work.id, node); else slides.current.delete(work.id); }}>
          <div className="sequence-image"
            onTouchStart={event => { touchStart.current = event.touches.length === 1 ? event.touches[0].clientY : null; }}
            onTouchEnd={event => { if (view === "single" && touchStart.current !== null && event.changedTouches.length) { const distance = touchStart.current - event.changedTouches[0].clientY; if (Math.abs(distance) > 60) navigate(index + Math.sign(distance)); } touchStart.current = null; }}>
            <Image src={work.image} alt={work.alt} fill placeholder="blur" sizes="(max-width: 700px) 100vw, 60vw" preload={index === 0} />
          </div>
          <div className="sequence-information">
            <WorkInformation work={work} />
            {view === "list" && <GalleryControls index={index} total={filtered.length} title={work.title} onNavigate={navigate} />}
          </div>
        </article>)}
      </div>
      {view === "single" && filtered[currentIndex] && <GalleryControls persistent index={currentIndex} total={filtered.length} title={filtered[currentIndex].title} onNavigate={navigate} />}
      </div>
      {!filtered.length && <p className="empty-gallery" role="status">Todavía no hay obras en esta selección.</p>}
      <div className="archive-end"><span className="small-dot" /><p>Selección de muestra. Imágenes y fichas de ejemplo; no representan obras de Melanie.</p><span className="archive-end-line" /></div>
    </section>
  );
}






