export const feedTypeDefs = /* GraphQL */ `
  type Feed {
    id: ID!
    title: String!
    rssUrl: String!
    siteUrl: String!
    articles(input: ArticleListInput): ArticleConnection!
  },
  type Article {
    id: ID!
    feedId: ID!
    title: String!
    url: String!
    summary: String
    publishedAt: DateTime
  },
  type ArticleConnection {
    nodes: [Article!]!
    pageInfo: PageInfo!
  }

  input ArticleListInput {
    page: Int = 1
    perPage: Int = 30
    sort: ArticleSort = PUBLISHED_AT_DESC
  }

  enum ArticleSort {
    PUBLISHED_AT_ASC
    PUBLISHED_AT_DESC
  }
`;

export const feedQueryTypeDefs = /* GraphQL */ `
  feeds: [Feed!]!
  feed(id: ID!): Feed!
`;
