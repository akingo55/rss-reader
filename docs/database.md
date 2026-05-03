# DB設計
- DBはPostgreSQLを使用し、supabaseを利用して管理する。
- 各テーブルには基本的にcreated_at, updated_atのカラムを作成することを推奨するが、用途に応じて必要なカラムに変更しても構わない。

## ER図
```mermaid
erDiagram

feeds {
	int id PK
	string title
	string rss_url UK
	string site_url
	datetime created_at
	datetime updated_at
	}

articles {
	int id PK
	int feed_id FK
	string title
	string url
	string summary "nullable"
	datetime published_at "nullable"
  datetime created_at
	datetime updated_at
}

profiles {
	string id PK "uuid"
	string name "nullable"
	string email UK "nullable"
	string avatar_url "nullable"
	datetime created_at
	datetime updated_at
}

user_feeds {
	string profile_id PK,FK
	int feed_id PK,FK
	datetime created_at
	datetime updated_at
}

article_reads {
	string profile_id PK,FK
	int article_id PK,FK
	datetime read_at
}

profiles ||--o{ user_feeds: ""
profiles ||--o{ article_reads: ""
articles ||--o{ article_reads: ""
feeds ||--o{ user_feeds: ""
feeds ||--o{ articles: ""
```

## Index定義
- articlesテーブル
  - feed_id, urlでユニークインデックスを作成する。これにより、同じフィード内で同じURLの記事が重複して保存されるのを防ぐ。
- profilesテーブル
  - emailでユニークインデックスを作成する。ただし、Github認証ではメールアドレスを取得できない場合があるためnullableとする。

## その他制約
- profilesテーブルのidはSupabase Authのauth.users.idをそのまま利用する。auth.users.idはUUIDであり、ログインをGithub認証にし、Supabase Authを利用するため都合が良い。大量にユーザーが登録されることを想定していないため、パフォーマンス懸念はないと考えている。
