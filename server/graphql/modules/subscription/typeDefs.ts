export const subscriptionQueryTypeDefs = /* GraphQL */ `
  myFeeds: [Feed!]!
`;

export const subscriptionMutationTypeDefs = /* GraphQL */ `
  subscribeFeed(feedId: ID!): Feed!
`;
