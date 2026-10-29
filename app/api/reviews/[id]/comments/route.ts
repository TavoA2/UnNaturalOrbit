import { z } from "zod";
import { commentSchema } from "@/validations/community";
import { authorName, communityClient, member } from "@/lib/community";
import { assertOrigin, databaseError, failure, HttpError, json, parseBody } from "@/lib/http";

async function reviewId(params: Promise<{ id: string }>) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) throw new HttpError(400, "Identificador inválido.");
  return id;
}
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await reviewId(params);
    const page = Number(new URL(request.url).searchParams.get("page") ?? 0);
    if (!Number.isSafeInteger(page) || page < 0 || page > 10000) throw new HttpError(400, "Página inválida.");
    const client = await communityClient();
    const { data, error } = await client.from("comments").select("id,body,author_id,author_name,created_at")
      .eq("review_id", id).order("created_at").order("id").range(page * 20, page * 20 + 19);
    if (error) databaseError(error.code);
    return json({ comments: data });
  } catch (error) { return failure(error); }
}
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertOrigin(request);
    const id = await reviewId(params);
    const { client, user } = await member();
    const input = await parseBody(request, commentSchema);
    const { error } = await client.from("comments").insert({ ...input, review_id: id, author_id: user.id, author_name: authorName(user) });
    if (error?.code === "23503") throw new HttpError(404, "La reseña ya no está disponible.");
    if (error) databaseError(error.code);
    return json({ id: input.id }, 201);
  } catch (error) { return failure(error); }
}

