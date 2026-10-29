import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { melanieCastro as artist } from "@/lib/artists";

export const metadata = {
  title: "Contacto · UnnaturalOrbit",
  description: "Datos de contacto de Melanie Castro para consultas sobre tatuajes y artes visuales.",
};

export default function ContactPage() {
  return (
    <div className="home-shell">
      <SiteHeader />
      <main id="contenido" className="artist-page contact-page">
        <Link href="/" className="artist-back"><ArrowLeft size={13} aria-hidden="true" /> Volver al inicio</Link>
        <section className="artist-profile" aria-labelledby="contact-title">
          <div>
            <h1 id="contact-title">Hablemos<br /><em>de tu idea.</em></h1>
            <p className="contact-intro">Para consultar sobre una obra o compartir una idea de tatuaje, cuadro o proyecto visual, contacta directamente con Melanie.</p>
          </div>
          <div className="artist-profile-details contact-details">
            <h2>{artist.name}</h2>
            <p className="artist-presentation">{artist.presentation}</p>
            <dl className="contact-data">
              <dt>Correo electrónico</dt>
              <dd><a href={`mailto:${artist.email}`}>{artist.email}</a></dd>
              <dt>Disciplinas</dt>
              <dd>{artist.disciplines.join(" · ")}</dd>
            </dl>
            <p className="contact-guidance">Incluye el tipo de proyecto, el tamaño aproximado y las referencias que quieras compartir.</p>
            <a href={`mailto:${artist.email}`} className="text-link artist-contact">Escribir por correo <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </section>
      </main>
      <footer className="gallery-footer"><Link href="/" className="footer-brand">unnaturalorbit.</Link><p>Arte que encuentra su órbita.</p></footer>
    </div>
  );
}
