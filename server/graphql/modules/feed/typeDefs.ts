export const feedTypeDefs = /* GraphQL */ `
  type Feed {
    id: ID!
    title: String!
    rssUrl: String!
  }
`;

export const feedQueryTypeDefs = /* GraphQL */ `
  feeds: [Feed!]!
`;
