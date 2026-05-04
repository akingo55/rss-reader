"use client";

import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();

    window.location.href = "/";
  }

  return (
    <button type="button" onClick={signOut}>
      ログアウト
    </button>
  );
}

