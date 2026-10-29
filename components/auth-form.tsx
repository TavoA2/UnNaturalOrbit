"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { credentialsSchema } from "@/validations/community";
import { api, message } from "@/lib/api-client";

const schema = credentialsSchema.extend({ name: z.string().max(50) });
type Values = z.infer<typeof schema>;

export function AuthForm({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [notice, setNotice] = useState("");
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema), defaultValues: { email: "", password: "", name: "" },
  });
  async function submit(values: Values) {
    setNotice("");
    if (mode === "signup" && values.name.trim().length < 2) {
      setError("name", { message: "Escribe al menos 2 caracteres." }); return;
    }
    try {
      const input = mode === "login" ? { action: mode, email: values.email, password: values.password } : { action: mode, ...values };
      const result = await api<{ message: string }>("/api/auth", { method: "POST", body: JSON.stringify(input) });
      if (mode === "login") { router.push("/resenas"); router.refresh(); }
      else { reset(); setNotice(result.message); }
    } catch (error) { setNotice(message(error)); }
  }
  return (
    <div>
      <div className="mb-8 flex gap-6 border-b border-current/20" role="group" aria-label="Tipo de acceso">
        {(["login", "signup"] as const).map(value => (
          <button key={value} type="button" disabled={isSubmitting} aria-pressed={mode === value}
            className={`pb-3 text-sm ${mode === value ? "border-b-2 border-current font-bold" : "opacity-70"}`}
            onClick={() => { setMode(value); setNotice(""); reset(); }}>
            {value === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
        <fieldset disabled={!enabled || isSubmitting} className="space-y-5 disabled:opacity-60">
          {mode === "signup" && <div>
            <label htmlFor="name">Nombre público</label>
            <input id="name" autoComplete="nickname" maxLength={50} {...register("name")} aria-invalid={!!errors.name} aria-describedby="name-error" />
            <p id="name-error" className="field-error">{errors.name?.message}</p>
          </div>}
          <div>
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} aria-describedby="email-error" />
            <p id="email-error" className="field-error">{errors.email?.message}</p>
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} {...register("password")} aria-invalid={!!errors.password} aria-describedby="password-error" />
            <p id="password-error" className="field-error">{errors.password?.message}</p>
          </div>
          {mode === "signup" && <p className="text-xs leading-relaxed">Tu nombre público aparecerá junto a tus aportes. El correo no se mostrará. Las cuentas nuevas no tienen permisos de administración.</p>}
          <button className="button-primary w-full" type="submit">{isSubmitting ? "Un momento…" : mode === "login" ? "Entrar a mi órbita" : "Crear mi cuenta"}</button>
        </fieldset>
        <p role="status" className="text-sm leading-relaxed">{notice}</p>
      </form>
    </div>
  );
}

