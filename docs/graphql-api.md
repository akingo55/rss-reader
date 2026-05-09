# GraphQL API設計書

RSSリーダーの画面設計書とDB設計書、および現在のGraphQL設定をもとに、画面から利用するGraphQL APIの設計を整理します。
この設計書には、現在実装済みのAPIと今後実装するAPIの両方を含めます。

## 1. 前提

- GraphQLエンドポイントは `app/api/graphql/route.ts` で提供する `/api/graphql` とします。
- GraphQLサーバーは `graphql-yoga` を利用します。
- DBアクセスは Prisma Client を利用します。
- 認証は Supabase Auth のセッションCookieをもとに判定します。
- GraphQLの `context.user` は `server/graphql/context.ts` の `GraphQLContext` として扱います。
- 未ログインでも公開情報としてフィード一覧、フィード詳細、記事一覧は参照できます。
- 購読、購読解除、既読登録、プロフィール参照、購読フィード参照、フィード追加はログイン必須です。

## 2. 現在の実装状況

現在の `server/graphql/schema.ts` では、以下のAPIが実装されています。

| 種別 | API | 認証 | 状態 | 備考 |
| --- | --- | --- | --- | --- |
| Query | `feeds` | 任意 | 実装済み | 全フィードを返します。検索、ページネーション、購読状態は未対応です。 |
| Query | `me` | 必須 | 実装済み | ログインユーザーの `profiles` を返します。 |
| Query | `myFeeds` | 必須 | 実装済み | ログインユーザーが購読中のフィードを返します。 |
| Mutation | `subscribeFeed` | 必須 | 実装済み | `user_feeds` に購読関係を作成します。 |

現在の実装では `Feed` 型に `siteUrl`、`createdAt`、`updatedAt` が含まれていないため、画面設計で必要な表示項目を満たすには拡張が必要です。
また、記事一覧、フィード詳細、購読解除、既読登録、フィード追加は未実装です。

## 3. 共通仕様

### 3.1 ID

- GraphQLのID型は `ID!` として公開します。
- DB上の `feeds.id` と `articles.id` は `Int` ですが、GraphQLでは `ID` として扱います。
- Resolverでは数値IDに変換し、数値に変換できないIDは入力エラーとします。

### 3.2 日時

- 日時は `DateTime` スカラーとして返します。
- Prismaの `DateTime` はISO 8601文字列としてクライアントに返す想定です。

### 3.3 ページネーション

- 記事一覧は画面設計に合わせて1ページ30件を初期値とします。
- `page` は1始まりとします。
- `perPage` の初期値は30、最大値は100とします。
- 31件以上ある場合は `pageInfo` を利用してページネーションを表示します。

### 3.4 並び順

- 記事一覧の初期値は公開日時の新しい順です。
- `publishedAt` が未設定の記事は、新しい順、古い順のどちらでも末尾に表示します。

### 3.5 エラー

| コード | 用途 |
| --- | --- |
| `UNAUTHENTICATED` | ログインが必要なAPIを未ログインで実行した場合 |
| `FORBIDDEN` | ログイン中でも対象リソースを操作する権限がない場合 |
| `NOT_FOUND` | 指定したフィード、記事、プロフィールが存在しない場合 |
| `BAD_USER_INPUT` | URL形式不正、ID形式不正、ページ指定不正など |
| `CONFLICT` | すでに登録済みのRSS URLなど、重複が問題になる場合 |
| `RSS_FETCH_FAILED` | RSSの取得または解析に失敗した場合 |

現在の実装では `new Error("Unauthorized")` を投げていますが、今後はGraphQLエラーの `extensions.code` に上記コードを設定する方針とします。

## 4. GraphQL SDL案

```graphql
scalar DateTime

enum ArticleSort {
  PUBLISHED_AT_DESC
  PUBLISHED_AT_ASC
}

type PageInfo {
  page: Int!
  perPage: Int!
  totalCount: Int!
  totalPages: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}

type Profile {
  id: ID!
  name: String
  email: String
  avatarUrl: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Feed {
  id: ID!
  title: String!
  rssUrl: String!
  siteUrl: String!
  isSubscribed: Boolean!
  subscribedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Article {
  id: ID!
  feedId: ID!
  title: String!
  url: String!
  summary: String
  publishedAt: DateTime
  isRead: Boolean!
  readAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}

type FeedConnection {
  nodes: [Feed!]!
  pageInfo: PageInfo!
}

type ArticleConnection {
  nodes: [Article!]!
  pageInfo: PageInfo!
}

type FeedDetail {
  feed: Feed!
  articles: ArticleConnection!
}

input FeedListInput {
  query: String
  page: Int = 1
  perPage: Int = 30
}

input ArticleListInput {
  page: Int = 1
  perPage: Int = 30
  sort: ArticleSort = PUBLISHED_AT_DESC
}

input AddFeedInput {
  rssUrl: String!
}

type AddFeedPayload {
  feed: Feed!
  created: Boolean!
}

type SubscribeFeedPayload {
  feed: Feed!
}

type UnsubscribeFeedPayload {
  feedId: ID!
}

type MarkArticleReadPayload {
  article: Article!
}

type Query {
  feeds(input: FeedListInput): FeedConnection!
  feed(id: ID!, articlesInput: ArticleListInput): FeedDetail!
  me: Profile!
  myFeeds(input: FeedListInput): FeedConnection!
  myFeed(id: ID!, articlesInput: ArticleListInput): FeedDetail!
}

type Mutation {
  addFeed(input: AddFeedInput!): AddFeedPayload!
  subscribeFeed(feedId: ID!): SubscribeFeedPayload!
  unsubscribeFeed(feedId: ID!): UnsubscribeFeedPayload!
  markArticleRead(articleId: ID!): MarkArticleReadPayload!
}
```

## 5. Query設計

### 5.1 `feeds`

登録済みの全フィードを一覧取得します。

- 認証: 任意
- 対応画面: フィード一覧画面
- DB: `feeds`, ログイン中のみ `user_feeds`
- 状態: 現在は簡易版のみ実装済み

#### 入力

| 項目 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `query` | `String` | 任意 | `title`、`rssUrl`、`siteUrl` の部分一致検索に利用します。 |
| `page` | `Int` | 任意 | 1始まりのページ番号です。 |
| `perPage` | `Int` | 任意 | 1ページあたりの件数です。 |

#### 出力

- `FeedConnection`
- ログイン中の場合は、各フィードの `isSubscribed` と `subscribedAt` を設定します。
- 未ログインの場合は `isSubscribed` を `false`、`subscribedAt` を `null` とします。

### 5.2 `feed`

指定フィードの詳細と記事一覧を取得します。

- 認証: 任意
- 対応画面: フィード詳細画面
- DB: `feeds`, `articles`, ログイン中のみ `user_feeds`, `article_reads`
- 状態: 未実装

#### 入力

| 項目 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `id` | `ID!` | 必須 | フィードIDです。 |
| `articlesInput` | `ArticleListInput` | 任意 | 記事一覧のページングと並び順です。 |

#### 出力

- `FeedDetail`
- ログイン中の場合は購読状態と既読状態を含めます。
- 未ログインの場合は `isSubscribed` を `false`、記事の `isRead` を `false` とします。

### 5.3 `me`

ログインユーザーのプロフィールを取得します。

- 認証: 必須
- 対応画面: ホーム画面、プロフィール管理画面
- DB: `profiles`
- 状態: 実装済み

#### 出力

- `Profile`
- プロフィールが存在しない場合は `NOT_FOUND` とします。

### 5.4 `myFeeds`

ログインユーザーが購読中のフィード一覧を取得します。

- 認証: 必須
- 対応画面: ホーム画面、購読フィード管理画面
- DB: `user_feeds`, `feeds`
- 状態: 現在は簡易版のみ実装済み

#### 入力

| 項目 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `query` | `String` | 任意 | 購読中フィードを対象に検索します。 |
| `page` | `Int` | 任意 | 1始まりのページ番号です。 |
| `perPage` | `Int` | 任意 | 1ページあたりの件数です。 |

#### 出力

- `FeedConnection`
- `isSubscribed` は常に `true` とします。
- `subscribedAt` は `user_feeds.created_at` を返します。

### 5.5 `myFeed`

ログインユーザーが購読しているフィードの詳細と記事一覧を取得します。

- 認証: 必須
- 対応画面: 購読フィード詳細画面
- DB: `user_feeds`, `feeds`, `articles`, `article_reads`
- 状態: 未実装

#### 入力

| 項目 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `id` | `ID!` | 必須 | フィードIDです。 |
| `articlesInput` | `ArticleListInput` | 任意 | 記事一覧のページングと並び順です。 |

#### 出力

- `FeedDetail`
- ログインユーザーが購読していないフィードの場合は `FORBIDDEN` とします。
- 既読済みの記事は `isRead: true` と `readAt` を返します。

## 6. Mutation設計

### 6.1 `addFeed`

RSS URLを登録し、フィードと記事を保存します。

- 認証: 必須
- 対応画面: フィード一覧画面のフィード追加ダイアログ
- DB: `feeds`, `articles`
- 状態: 未実装

#### 入力

| 項目 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `rssUrl` | `String!` | 必須 | 追加するRSS URLです。 |

#### 処理

1. URL形式を検証します。
2. `feeds.rss_url` に同じURLが存在するか確認します。
3. 既存フィードがある場合は新規作成せず、`created: false` として既存フィードを返します。
4. RSSを取得、解析し、フィードタイトル、サイトURL、記事情報を抽出します。
5. `feeds` にフィードを作成します。
6. `articles` に記事を登録します。同一フィード内で同じURLの記事は重複登録しません。
7. `created: true` として作成したフィードを返します。

#### 補足

- RSSフィードの取得、解析、記事保存をどのタイミングで実行するかは画面設計書の未確定事項です。
- 初期実装では `addFeed` の同期処理としてRSS取得と記事保存まで行う想定にします。
- 取得処理が重くなる場合は、後続でバックグラウンドジョブ化を検討します。

### 6.2 `subscribeFeed`

ログインユーザーが指定フィードを購読します。

- 認証: 必須
- 対応画面: フィード一覧画面、フィード詳細画面
- DB: `user_feeds`, `feeds`
- 状態: 現在は簡易版のみ実装済み

#### 入力

| 項目 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `feedId` | `ID!` | 必須 | 購読するフィードIDです。 |

#### 処理

1. フィードIDを検証します。
2. 対象フィードが存在することを確認します。
3. `user_feeds` に `profile_id` と `feed_id` を登録します。
4. すでに購読済みの場合はエラーにせず、既存状態を維持してフィードを返します。

### 6.3 `unsubscribeFeed`

ログインユーザーが指定フィードの購読を解除します。

- 認証: 必須
- 対応画面: 購読フィード管理画面
- DB: `user_feeds`
- 状態: 未実装

#### 入力

| 項目 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `feedId` | `ID!` | 必須 | 購読解除するフィードIDです。 |

#### 処理

1. フィードIDを検証します。
2. ログインユーザーの `user_feeds` を削除します。
3. フィード本体と記事は削除しません。
4. 未購読の場合はエラーにせず、削除済みとして扱います。

### 6.4 `markArticleRead`

ログインユーザーが指定記事を既読にします。

- 認証: 必須
- 対応画面: 購読フィード詳細画面
- DB: `article_reads`, `articles`, `user_feeds`
- 状態: 未実装

#### 入力

| 項目 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `articleId` | `ID!` | 必須 | 既読登録する記事IDです。 |

#### 処理

1. 記事IDを検証します。
2. 対象記事が存在することを確認します。
3. 記事が属するフィードをログインユーザーが購読していることを確認します。
4. `article_reads` に `profile_id`、`article_id`、`read_at` を登録します。
5. すでに既読の場合は重複登録せず、既存の既読状態を返します。
6. 既読を未読へ戻すAPIは提供しません。

## 7. 画面との対応

| 画面 | 主に利用するAPI |
| --- | --- |
| ホーム画面 | `me`, `myFeeds` |
| フィード一覧画面 | `feeds`, `addFeed`, `subscribeFeed` |
| フィード詳細画面 | `feed`, `subscribeFeed` |
| 購読フィード詳細画面 | `myFeed`, `markArticleRead` |
| 購読フィード管理画面 | `myFeeds`, `unsubscribeFeed` |
| プロフィール管理画面 | `me` |

## 8. 実装優先度

1. `Feed` 型に `siteUrl`、購読状態、日時を追加します。
2. `feeds` と `myFeeds` を `Connection` 形式、検索、ページネーション対応にします。
3. `feed` を追加し、公開フィード詳細と記事一覧を取得できるようにします。
4. `myFeed` を追加し、購読中フィードの既読状態付き記事一覧を取得できるようにします。
5. `unsubscribeFeed` と `markArticleRead` を追加します。
6. `addFeed` を追加し、RSS取得、解析、記事保存を実装します。
7. GraphQLエラーの `extensions.code` を共通化します。

## 9. クエリ例

### フィード一覧

```graphql
query Feeds($input: FeedListInput) {
  feeds(input: $input) {
    nodes {
      id
      title
      rssUrl
      siteUrl
      isSubscribed
    }
    pageInfo {
      page
      perPage
      totalCount
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
}
```

### フィード詳細

```graphql
query Feed($id: ID!, $articlesInput: ArticleListInput) {
  feed(id: $id, articlesInput: $articlesInput) {
    feed {
      id
      title
      siteUrl
      isSubscribed
    }
    articles {
      nodes {
        id
        title
        url
        summary
        publishedAt
        isRead
        readAt
      }
      pageInfo {
        page
        totalPages
        hasNextPage
      }
    }
  }
}
```

### 購読

```graphql
mutation SubscribeFeed($feedId: ID!) {
  subscribeFeed(feedId: $feedId) {
    feed {
      id
      title
      isSubscribed
      subscribedAt
    }
  }
}
```

### 既読登録

```graphql
mutation MarkArticleRead($articleId: ID!) {
  markArticleRead(articleId: $articleId) {
    article {
      id
      isRead
      readAt
    }
  }
}
```

## 10. 未確定事項

- RSS取得と記事保存を同期APIとして扱うか、バックグラウンド処理に分離するか。
- フィード追加時に自動購読まで行うか。現時点ではフィード作成のみとし、購読は `subscribeFeed` を別途呼び出す設計にします。
- プロフィールがSupabase Auth側に存在するが `profiles` に存在しない場合、自動作成するかエラーにするか。
- GraphQLの `DateTime` スカラー実装を自前で用意するか、既存ライブラリを追加するか。
- API利用者向けにGraphiQLを有効にするか、本番では無効化するか。
