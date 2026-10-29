import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";
export const metadata = { title: "Administración de comunidad" };
export default async function Admin() {
  const client = await createClient();
  if (!client) redirect("/login");
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/login");
  const { data: admin, error } = await client.rpc("is_admin");
  if (error || !admin) return <div className="mx-auto max-w-7xl px-6 md:px-12"><SiteHeader /><main id="contenido" className="py-20"><h1 className="font-serif text-4xl">Acceso restringido</h1><p className="mt-6">Tu cuenta no tiene permisos administrativos o no se pudo verificarlos.</p><Link href="/resenas" className="mt-6 inline-block underline">Volver a la comunidad</Link></main></div>;
  const [reviews, comments] = await Promise.all([
    client.from("reviews").select("id", { head: true, count: "exact" }),
    client.from("comments").select("id", { head: true, count: "exact" }),
  ]);
  return <div className="mx-auto max-w-7xl px-6 md:px-12"><SiteHeader />
    <main id="contenido" className="py-16">
      <p className="eyebrow">Administración</p><h1 className="mt-4 font-serif text-5xl">Cuidar la conversación.</h1>
      {reviews.error || comments.error ? <p role="alert" className="notice mt-8">No se pudieron cargar los datos.</p> : <div className="my-10 flex flex-wrap gap-12"><p><strong className="block font-serif text-5xl">{reviews.count}</strong> reseñas</p><p><strong className="block font-serif text-5xl">{comments.count}</strong> comentarios</p></div>}
      <p className="max-w-xl leading-relaxed">Revisa las conversaciones y elimina aportes que incumplan las normas. Como administrador verás la opción de eliminar junto a cada reseña y comentario.</p>
      <Link href="/resenas" className="button-primary mt-8 inline-block">Moderar comunidad ↗</Link>
    </main></div>;
}


