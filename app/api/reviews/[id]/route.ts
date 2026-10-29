import { z } from "zod";
import { member } from "@/lib/community";
import { assertOrigin, databaseError, failure, HttpError, json } from "@/lib/http";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertOrigin(request);
    const { id } = await params;
    if (!z.uuid().safeParse(id).success) throw new HttpError(400, "Identificador inválido.");
    const { client } = await member();
    // RLS only permits the owner or an administrator to delete.
    const { data, error } = await client.from("reviews").delete().eq("id", id).select("id");
    if (error) databaseError(error.code);
    if (!data?.length) throw new HttpError(404, "Reseña no disponible o sin permiso.");
    return json({ deleted: true });
  } catch (error) { return failure(error); }
}

