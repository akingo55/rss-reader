import { LoginButton } from "@/app/components/login-button";
import { LogoutButton } from "@/app/components/logout-button";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main>
      <h1>rss-reader</h1>

      {user ? (
        <div>
          <p>ログイン済み</p>
          <p>{user.email ?? user.id}</p>
          <LogoutButton />
        </div>
      ) : (
        <LoginButton />
      )}
    </main>
  );
}

