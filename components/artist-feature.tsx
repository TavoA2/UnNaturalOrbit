import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { melanieCastro as artist } from "@/lib/artists";

export function ArtistFeature() {
  return (
    <section id="artistas" className="artist-feature" aria-labelledby="artist-feature-title">
      <div className="artist-feature-heading">
        <span className="eyebrow">Artistas en órbita / 01</span>
        <h2 id="artist-feature-title">Melanie<br /><em>Castro.</em></h2>
        <span className="artist-presentation">{artist.presentation}</span>
      </div>
      <div className="artist-feature-content">
        <p className="artist-feature-intro">Tatuaje y artes visuales.<br />Distintos soportes, una mirada propia.</p>
        <ul className="discipline-list" aria-label="Disciplinas de Melanie Castro">
          {artist.disciplines.map(discipline => <li key={discipline}>{discipline}</li>)}
        </ul>
        <div className="artist-feature-links">
          <Link href="/contact" className="text-link">Contacto <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}

