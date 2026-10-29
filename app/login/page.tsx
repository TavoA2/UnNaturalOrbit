import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { SiteHeader } from "@/components/site-header";
import { supabaseConfig } from "@/lib/supabase/config";

export const metadata = { title: "Iniciar sesión" };
export default async function Login({ searchParams }: { searchParams: Promise<{ confirmacion?: string }> }) {
  const configured = !!supabaseConfig();
  const { confirmacion } = await searchParams;
  return <div className="mx-auto max-w-7xl px-6 md:px-12">
    <SiteHeader />
    <main id="contenido" className="grid gap-12 py-16 md:grid-cols-2 md:gap-24 md:py-24">
      <section>
        <p className="eyebrow">Participa en la conversación</p>
        <h1 className="mt-6 font-serif text-5xl leading-tight md:text-6xl">Tu mirada también<br />forma parte.</h1>
        <p className="mt-8 max-w-md leading-relaxed">Comparte reseñas de obras, artistas y proyectos culturales. Encuentra otras perspectivas y conversa con la comunidad.</p>
        <Link href="/resenas" className="mt-8 inline-block border-b border-current text-sm">Explorar sin iniciar sesión ↗</Link>
      </section>
      <section className="max-w-md" aria-label="Acceso a tu cuenta">
        {!configured && <p className="notice mb-6" role="status">El acceso se habilitará al conectar Supabase. Todavía no es posible crear cuentas ni iniciar sesión.</p>}
        {confirmacion === "error" && <p role="alert" className="notice mb-6">El enlace no es válido o ha expirado. Solicita ayuda al administrador o inicia sesión si ya confirmaste tu correo.</p>}
        <AuthForm enabled={configured} />
      </section>
    </main>
  </div>;
}

