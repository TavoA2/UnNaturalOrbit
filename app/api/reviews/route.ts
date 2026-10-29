import { reviewSchema } from "@/validations/community";
import { authorName, communityClient, member } from "@/lib/community";
import { assertOrigin, databaseError, failure, HttpError, json, parseBody } from "@/lib/http";

export async function GET(request: Request) {
  try {
    const page = Number(new URL(request.url).searchParams.get("page") ?? 0);
    if (!Number.isSafeInteger(page) || page < 0 || page > 10000) throw new HttpError(400, "Página inválida.");
    const client = await communityClient();
    const { data, error } = await client.from("reviews")
      .select("id,title,subject,body,author_id,author_name,created_at")
      .order("created_at", { ascending: false }).order("id")
      .range(page * 10, page * 10 + 9);
    if (error) databaseError(error.code);
    return json({ reviews: data });
  } catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  try {
    assertOrigin(request);
    const { client, user } = await member();
    const input = await parseBody(request, reviewSchema);
    const { error } = await client.from("reviews").insert({ ...input, author_id: user.id, author_name: authorName(user) });
    if (error) databaseError(error.code);
    return json({ id: input.id }, 201);
  } catch (error) { return failure(error); }
}

