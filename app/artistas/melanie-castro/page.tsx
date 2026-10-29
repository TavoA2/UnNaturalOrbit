import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { melanieCastro as artist } from "@/lib/artists";

export const metadata = {
  title: "Melanie Castro · Tatuaje y artes visuales",
  description: "Conoce el portafolio de Melanie Castro: tatuaje, cuadros al óleo, murales, arte digital y animación 2D.",
};
export default function ArtistPage() {
  return (
    <div className="home-shell">
      <SiteHeader />
      <main id="contenido" className="artist-page">
        <Link href="/#artistas" className="artist-back"><ArrowLeft size={13} aria-hidden="true" /> Artistas en órbita</Link>
        <section className="artist-profile" aria-labelledby="artist-name">
          <div>
            <p className="eyebrow">Tatuaje y artes visuales</p>
            <h1 id="artist-name">Melanie<br /><em>Castro.</em></h1>
            <p className="artist-presentation">{artist.presentation}</p>
          </div>
          <div className="artist-profile-details">
            <p className="eyebrow">Medios en los que realiza obras</p>
            <ul className="artist-media">
              {artist.disciplines.map((discipline, index) => <li key={discipline}><span>{String(index + 1).padStart(2, "0")}</span>{discipline}</li>)}
            </ul>
            <Link href="/contact" className="button-primary artist-contact">Contacto <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </section>
        <section className="artist-flash" aria-labelledby="flash-title">
          <div className="archive-heading">
            <div><span className="eyebrow">Selección de su portafolio</span><h2 id="flash-title">Diseños flash<span className="heading-period">.</span></h2></div>
            <p className="flash-note">Cada enlace abre el diseño original.<br />Consulta con Melanie su disponibilidad.</p>
          </div>
          <div className="flash-designs">
            {artist.flashDesigns.map((design, index) => <a key={design.title} href={design.sourceImage} target="_blank" rel="noopener noreferrer" className="flash-design" aria-label={`Ver diseño original: ${design.title} (abre en otra pestaña)`}>
              <span className="flash-index">{String(index + 1).padStart(2, "0")}</span><h3>{design.title}</h3><ArrowUpRight size={18} strokeWidth={1.2} aria-hidden="true" />
            </a>)}
          </div>
          <p className="artist-source">Información de su <a href={artist.source} target="_blank" rel="noopener noreferrer">portafolio original ↗</a>. Los diseños enlazados pertenecen a Melanie; las imágenes de muestra de la galería principal son independientes.</p>
        </section>
      </main>
      <footer className="gallery-footer"><Link href="/" className="footer-brand">unnaturalorbit.</Link><p>Arte que encuentra su órbita.</p><Link href="/#archivo" className="text-link">Volver al archivo <ArrowUpRight size={14} aria-hidden="true" /></Link></footer>
    </div>
  );
}

