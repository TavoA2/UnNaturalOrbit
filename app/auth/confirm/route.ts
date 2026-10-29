import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token_hash = url.searchParams.get("token_hash");
  const code = url.searchParams.get("code");
  const client = await createClient();
  if (client) {
    if (token_hash && url.searchParams.get("type") === "email") {
      const { error } = await client.auth.verifyOtp({ token_hash, type: "email" });
      if (!error) return NextResponse.redirect(new URL("/resenas", url));
    } else if (code) {
      const { error } = await client.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL("/resenas", url));
    }
  }
  return NextResponse.redirect(new URL("/login?confirmacion=error", url));
}

