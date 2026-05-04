import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/server/db/client";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  let next = searchParams.get("next") ?? "/";

  if (!next.startsWith("/")) {
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const result = await supabase.auth.getUser();
      const user = result.data.user;
      if (user) {
        const metadata = user.user_metadata;

        await prisma.profile.upsert({
          where: { id: user.id },
          update: {
            email: user.email,
            name: metadata.name ?? metadata.user_name ?? null,
            avatarUrl: metadata.avatar_url ?? null,
          },
          create: {
            id: user.id,
            email: user.email,
            name: metadata.name ?? metadata.user_name ?? null,
            avatarUrl: metadata.avatar_url ?? null,
          },
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

