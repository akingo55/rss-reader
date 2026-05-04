import { LoginButton } from "@/app/components/login-button";
import { LogoutButton } from "@/app/components/logout-button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const sampleArticles = [
  {
    source: "Engineering Notes",
    title: "Next.js の更新差分を読む",
    time: "09:20",
    state: "未読",
  },
  {
    source: "Product Weekly",
    title: "プロダクト指標の見直し",
    time: "昨日",
    state: "既読",
  },
  {
    source: "Design Dispatch",
    title: "読みやすい一覧画面の余白設計",
    time: "4/30",
    state: "未読",
  },
];

const navigationItems = [
  { label: "ホーム", href: "/" },
  { label: "フィード一覧", href: "/feeds" },
  { label: "購読フィード管理", href: "/myfeeds" },
  { label: "プロフィール管理", href: "/profile" },
];

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#1d2420]">
      {user ? (
        <AuthenticatedHome
          userLabel={user.email ?? user.user_metadata?.user_name ?? user.id}
        />
      ) : (
        <PublicHome />
      )}
    </main>
  );
}

function PublicHome() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8">
      <header className="flex items-center justify-between border-b border-[#d8d1c3] pb-5">
        <Link className="text-xl font-semibold tracking-normal" href="/">
          rss-reader
        </Link>
        <nav aria-label="メインナビゲーション" className="flex items-center gap-3">
          <Link
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-[#526057] transition hover:bg-[#ece6dc] sm:inline-flex"
            href="/feeds"
          >
            フィード一覧
          </Link>
          <LoginButton />
        </nav>
      </header>

      <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_0.86fr] lg:py-16">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#597066]">
            GitHubログインで始めるRSSリーダー
          </p>
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-normal text-[#16201b] sm:text-6xl lg:text-7xl">
            rss-reader
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#526057]">
            購読したフィードの記事をまとめて確認し、読んだ記事は自動で既読にできます。
            情報収集の入口をひとつに寄せるための、静かで扱いやすいRSSリーダーです。
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LoginButton />
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#b9afa0] px-5 text-sm font-semibold text-[#27342e] transition hover:border-[#78887f] hover:bg-[#eee8dd]"
              href="/feeds"
            >
              フィードを探す
            </Link>
          </div>
        </div>

        <FeedPreview />
      </section>
    </div>
  );
}

function AuthenticatedHome({ userLabel }: { userLabel: string }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-[#d8d1c3] bg-[#ede7dd] px-5 py-5 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 lg:block">
          <Link className="text-xl font-semibold" href="/">
            rss-reader
          </Link>
          <div className="lg:hidden">
            <LogoutButton />
          </div>
        </div>

        <nav
          aria-label="ログイン中ナビゲーション"
          className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-1"
        >
          {navigationItems.map((item) => (
            <Link
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#3d4c44] transition hover:bg-[#ded6c8]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-[#d8d1c3] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#657269]">ログイン中</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal text-[#17231d]">
              ホーム
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="max-w-[280px] truncate rounded-full bg-white px-4 py-2 text-sm text-[#4a574f] shadow-sm ring-1 ring-[#ded8cd]">
              {userLabel}
            </p>
            <div className="hidden sm:block">
              <LogoutButton />
            </div>
          </div>
        </header>

        <div className="grid gap-5 py-6 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-[#ded8cd]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#607168]">
                  購読フィード
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                  読み始める場所
                </h2>
                <p className="mt-3 max-w-2xl leading-7 text-[#5f6b64]">
                  購読中のフィードは管理画面から確認できます。まだ購読していない場合は、フィード一覧から追加します。
                </p>
              </div>
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#26352e] px-5 text-sm font-semibold text-white transition hover:bg-[#364a40]"
                href="/feeds"
              >
                フィードを探す
              </Link>
            </div>

            <div className="mt-6 grid gap-3">
              {sampleArticles.map((article) => (
                <article
                  className="flex flex-col gap-3 rounded-lg border border-[#e5ded3] bg-[#fbfaf7] p-4 sm:flex-row sm:items-center sm:justify-between"
                  key={article.title}
                >
                  <div>
                    <p className="text-xs font-semibold text-[#748178]">
                      {article.source}
                    </p>
                    <h3 className="mt-1 font-semibold text-[#1e2a24]">
                      {article.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#657269]">
                    <span>{article.time}</span>
                    <span className="rounded-full bg-[#e8eee9] px-3 py-1 text-xs font-semibold text-[#405149]">
                      {article.state}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg bg-[#26352e] p-6 text-white shadow-sm">
            <p className="text-sm font-semibold text-[#c8d8cf]">次の操作</p>
            <div className="mt-5 grid gap-3">
              <Link
                className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[#26352e] transition hover:bg-[#eef3ef]"
                href="/myfeeds"
              >
                購読フィードを管理する
              </Link>
              <Link
                className="rounded-lg border border-[#8da096] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#33473d]"
                href="/profile"
              >
                プロフィールを確認する
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function FeedPreview() {
  return (
    <section
      aria-label="記事一覧プレビュー"
      className="rounded-lg bg-[#17231d] p-4 text-white shadow-2xl shadow-[#c8bcaa]"
    >
      <div className="rounded-md border border-[#4d5f55] bg-[#203028]">
        <div className="flex items-center justify-between border-b border-[#4d5f55] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[#cfe3d8]">
              今日の記事
            </p>
            <p className="text-xs text-[#9bb0a6]">30件ずつ整理</p>
          </div>
          <span className="rounded-full bg-[#d9efe3] px-3 py-1 text-xs font-semibold text-[#203028]">
            新しい順
          </span>
        </div>
        <div className="grid gap-0">
          {sampleArticles.map((article) => (
            <article
              className="border-b border-[#405249] px-4 py-4 last:border-b-0"
              key={article.title}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#9fb4aa]">
                    {article.source}
                  </p>
                  <h2 className="mt-1 text-base font-semibold text-white">
                    {article.title}
                  </h2>
                </div>
                <span className="shrink-0 text-xs text-[#b8c8c0]">
                  {article.time}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
