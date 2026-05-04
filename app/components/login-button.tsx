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
    <button type="button" onClick={signInWithGitHub}>
      GitHubでログイン
    </button>
  );
}

