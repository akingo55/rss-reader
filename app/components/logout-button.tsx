"use client";

import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();

    window.location.href = "/";
  }

  return (
    <button
      className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#b9afa0] bg-white px-4 text-sm font-semibold text-[#27342e] shadow-sm transition hover:border-[#78887f] hover:bg-[#f6f1e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#597066]"
      type="button"
      onClick={signOut}
    >
      ログアウト
    </button>
  );
}
