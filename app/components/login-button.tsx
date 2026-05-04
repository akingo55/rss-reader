"use client";

import { createClient } from "@/lib/supabase/client";

export function LoginButton() {
  async function signInWithGitHub() {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <button
      className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#26352e] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#364a40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#597066]"
      type="button"
      onClick={signInWithGitHub}
    >
      GitHubでログイン
    </button>
  );
}
