import { SiteHeader } from "@/components/site-header";
import { Community } from "@/components/community";

export const metadata = { title: "Reseñas y conversaciones", description: "Comparte tu mirada sobre obras, artistas y proyectos culturales." };
export default function ReviewsPage() {
  return <div className="mx-auto max-w-7xl px-6 md:px-12">
    <SiteHeader />
    <main id="contenido" className="pb-20">
      <section className="max-w-3xl py-16 md:py-24">
        <p className="eyebrow">Reseñas · Ideas · Conversaciones</p>
        <h1 className="mt-6 font-serif text-5xl leading-tight sm:text-7xl">El arte continúa<br />en la conversación.</h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed">Un lugar para compartir lo que encontramos en el camino y descubrir lo que otras personas ven.</p>
      </section>
      <Community />
    </main>
  </div>;
}

