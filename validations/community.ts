import { z } from "zod";

export const reviewSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(3, "Escribe un título de al menos 3 caracteres.").max(120),
  subject: z.string().trim().min(2, "Indica la obra, artista o proyecto.").max(160),
  body: z.string().trim().min(20, "La reseña debe tener al menos 20 caracteres.").max(5000),
}).strict();

export const commentSchema = z.object({
  id: z.uuid(),
  body: z.string().trim().min(2, "Escribe al menos 2 caracteres.").max(1000),
}).strict();

export const credentialsSchema = z.object({
  email: z.email("Introduce un correo válido.").max(254),
  password: z.string().min(8, "Usa al menos 8 caracteres.").max(128),
});
export const authSchema = z.discriminatedUnion("action", [
  credentialsSchema.extend({ action: z.literal("login") }),
  credentialsSchema.extend({
    action: z.literal("signup"),
    name: z.string().trim().min(2, "Escribe tu nombre público.").max(50),
  }),
  z.object({ action: z.literal("logout") }),
]);

