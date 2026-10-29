import Link from "next/link";
import { ArrowDown, ArrowUpRight, Asterisk } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ArtistFeature } from "@/components/artist-feature";
import { ArtworkGallery } from "@/components/artwork-gallery";

export default function Home() {
  return (
    <div className="home-shell">
      <SiteHeader />
      <main id="contenido">
        <section className="gallery-hero" aria-labelledby="titulo">
          <div className="hero-kicker"><span className="small-dot" /> Plataforma cultural independiente</div>
          <div className="hero-composition">
            <h1 id="titulo">Otras formas<br />de <em>sentir</em> el mundo.</h1>
            <div className="hero-aside">
              <Asterisk className="hero-asterisk" size={38} strokeWidth={.8} aria-hidden="true" />
              <p>Arte que deja una huella.<br />Ideas que encuentran su órbita.</p>
              <a href="#archivo" className="text-link">Explorar el archivo <ArrowDown size={14} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="hero-baseline"><span>Un encuentro entre lo íntimo y lo inesperado.</span><span>Arte · Piel · Memoria</span></div>
        </section>
        <ArtworkGallery />
        <ArtistFeature />
        <section id="proyecto" className="project-note" aria-labelledby="project-title">
          <div className="project-label"><span className="eyebrow">Fuera de lo habitual</span><OrbitMark /></div>
          <div className="project-copy">
            <h2 id="project-title">No todo tiene que encajar.<br />Algunas cosas están hechas<br />para <em>encontrarse.</em></h2>
            <div className="project-bottom">
              <p>UnnaturalOrbit es un espacio independiente para acercar proyectos artísticos, compartir ideas y abrir conversaciones. Un lugar para mirar con tiempo y descubrir otras perspectivas.</p>
              <Link href="/resenas" className="text-link">Entra en la conversación <ArrowUpRight size={15} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="gallery-footer">
        <Link href="/" className="footer-brand">unnaturalorbit.</Link>
        <p>Cultura independiente. Miradas que se encuentran.</p>
        <a href="#contenido" className="text-link">Volver al inicio <ArrowUpRight size={14} aria-hidden="true" /></a>
      </footer>
    </div>
  );
}

function OrbitMark() {
  return <svg className="project-orbit" viewBox="0 0 200 160" fill="none" aria-hidden="true">
    <ellipse cx="100" cy="80" rx="88" ry="32" transform="rotate(-32 100 80)" />
    <ellipse cx="100" cy="80" rx="88" ry="32" transform="rotate(32 100 80)" />
    <circle cx="100" cy="80" r="5" fill="currentColor" stroke="none" />
  </svg>;
}


