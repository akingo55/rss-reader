export const feedTypeDefs = /* GraphQL */ `
  type Feed {
    id: ID!
    title: String!
    rssUrl: String!
    siteUrl: String!
    articles(input: ArticleListInput): ArticleConnection!
  },
  input CreateFeedInput {
    title: String!
    rssUrl: String!
    siteUrl: String!
  },
`;

export const feedQueryTypeDefs = /* GraphQL */ `
  feeds: [Feed!]!
  feed(id: ID!): Feed!
`;

export const feedMutationTypeDefs = /* GraphQL */ `
  createFeed(input: CreateFeedInput!): Feed!
`;
